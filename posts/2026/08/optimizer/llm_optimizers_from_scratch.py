"""Small, readable optimizer implementations for the accompanying notes.

This file is a teaching companion, not a replacement for fused framework kernels.
It contains:

1. AdamWFromScratch, verified against torch.optim.AdamW in float64.
2. A five-step Newton--Schulz polar-factor approximation.
3. MuonFromScratch for two-dimensional hidden weight matrices.

Run:
    python llm_optimizers_from_scratch.py

Dependency:
    pip install torch
"""

from __future__ import annotations

import math
from collections.abc import Iterable
from typing import Any

import torch


class AdamWFromScratch(torch.optim.Optimizer):
    """A deliberately direct AdamW implementation for dense tensors.

    State tensors use the parameter dtype. Production mixed-precision training
    should choose the state dtype explicitly and will usually prefer the fused or
    foreach implementation supplied by the framework.
    """

    def __init__(
        self,
        params: Iterable[torch.Tensor] | Iterable[dict[str, Any]],
        lr: float = 1e-3,
        betas: tuple[float, float] = (0.9, 0.999),
        eps: float = 1e-8,
        weight_decay: float = 0.0,
    ) -> None:
        if lr < 0:
            raise ValueError(f"lr must be non-negative, got {lr}")
        if eps < 0:
            raise ValueError(f"eps must be non-negative, got {eps}")
        if weight_decay < 0:
            raise ValueError(
                f"weight_decay must be non-negative, got {weight_decay}"
            )
        if not all(0.0 <= beta < 1.0 for beta in betas):
            raise ValueError(f"betas must lie in [0, 1), got {betas}")

        defaults = {
            "lr": lr,
            "betas": betas,
            "eps": eps,
            "weight_decay": weight_decay,
        }
        super().__init__(params, defaults)

    @torch.no_grad()
    def step(self, closure=None):
        loss = None
        if closure is not None:
            with torch.enable_grad():
                loss = closure()

        for group in self.param_groups:
            lr = group["lr"]
            beta1, beta2 = group["betas"]
            eps = group["eps"]
            weight_decay = group["weight_decay"]

            for parameter in group["params"]:
                gradient = parameter.grad
                if gradient is None:
                    # A missing gradient is skipped completely. In particular,
                    # the step counter and decoupled weight decay do not advance.
                    continue
                if gradient.is_sparse:
                    raise RuntimeError(
                        "AdamWFromScratch requires dense gradients"
                    )

                state = self.state[parameter]
                if not state:
                    state["step"] = 0
                    state["exp_avg"] = torch.zeros_like(parameter)
                    state["exp_avg_sq"] = torch.zeros_like(parameter)

                state["step"] += 1
                step = state["step"]
                exp_avg = state["exp_avg"]
                exp_avg_sq = state["exp_avg_sq"]

                exp_avg.mul_(beta1).add_(gradient, alpha=1.0 - beta1)
                exp_avg_sq.mul_(beta2).addcmul_(
                    gradient, gradient, value=1.0 - beta2
                )

                bias_correction1 = 1.0 - beta1**step
                bias_correction2 = 1.0 - beta2**step
                exp_avg_hat = exp_avg / bias_correction1
                exp_avg_sq_hat = exp_avg_sq / bias_correction2

                # AdamW: shrink separately so decay never enters either moment.
                parameter.mul_(1.0 - lr * weight_decay)
                denominator = exp_avg_sq_hat.sqrt().add_(eps)
                parameter.addcdiv_(exp_avg_hat, denominator, value=-lr)

        return loss


def zeropower_via_newton_schulz5(
    matrix: torch.Tensor,
    *,
    steps: int = 5,
    eps: float = 1e-7,
) -> torch.Tensor:
    """Approximate the polar factor U @ V.T of a two-dimensional matrix.

    If matrix = U @ S @ V.T is a compact SVD, the target is U @ V.T. The
    polynomial coefficients are the commonly used Muon quintic iteration. They
    favor a useful low-precision approximation after a few steps rather than
    high-accuracy asymptotic convergence.
    """

    if matrix.ndim != 2:
        raise ValueError(f"expected a 2-D matrix, got shape {tuple(matrix.shape)}")
    if steps < 0:
        raise ValueError(f"steps must be non-negative, got {steps}")
    if not matrix.is_floating_point():
        raise TypeError("matrix must have a floating-point dtype")

    original_dtype = matrix.dtype
    x = matrix.to(torch.bfloat16)
    transposed = x.shape[0] > x.shape[1]
    if transposed:
        x = x.mT

    x = x / (x.norm() + eps)
    a, b, c = 3.4445, -4.7750, 2.0315
    for _ in range(steps):
        gram = x @ x.mT
        correction = b * gram + c * (gram @ gram)
        x = a * x + correction @ x

    if transposed:
        x = x.mT
    return x.to(original_dtype)


class MuonFromScratch(torch.optim.Optimizer):
    """A compact Muon implementation for 2-D hidden weight matrices only.

    Non-matrix parameters should be routed to a separate optimizer such as
    AdamW. This class uses Nesterov momentum, Newton--Schulz orthogonalization,
    decoupled weight decay, and Moonlight-style RMS matching by default.
    """

    def __init__(
        self,
        params: Iterable[torch.Tensor] | Iterable[dict[str, Any]],
        lr: float = 0.02,
        momentum: float = 0.95,
        weight_decay: float = 0.0,
        nesterov: bool = True,
        ns_steps: int = 5,
        eps: float = 1e-7,
        match_rms_adamw: bool = True,
    ) -> None:
        if lr < 0:
            raise ValueError(f"lr must be non-negative, got {lr}")
        if not 0.0 <= momentum < 1.0:
            raise ValueError(f"momentum must lie in [0, 1), got {momentum}")
        if weight_decay < 0:
            raise ValueError(
                f"weight_decay must be non-negative, got {weight_decay}"
            )
        if ns_steps < 0:
            raise ValueError(f"ns_steps must be non-negative, got {ns_steps}")

        defaults = {
            "lr": lr,
            "momentum": momentum,
            "weight_decay": weight_decay,
            "nesterov": nesterov,
            "ns_steps": ns_steps,
            "eps": eps,
            "match_rms_adamw": match_rms_adamw,
        }
        super().__init__(params, defaults)

    @torch.no_grad()
    def step(self, closure=None):
        loss = None
        if closure is not None:
            with torch.enable_grad():
                loss = closure()

        for group in self.param_groups:
            for parameter in group["params"]:
                gradient = parameter.grad
                if gradient is None:
                    continue
                if gradient.ndim != 2:
                    raise ValueError(
                        "MuonFromScratch accepts only 2-D hidden matrices; "
                        f"route shape {tuple(gradient.shape)} to AdamW"
                    )
                if gradient.is_sparse:
                    raise RuntimeError("MuonFromScratch requires dense gradients")

                state = self.state[parameter]
                if not state:
                    state["momentum_buffer"] = torch.zeros_like(parameter)

                buffer = state["momentum_buffer"]
                momentum = group["momentum"]
                buffer.mul_(momentum).add_(gradient)
                direction = gradient.add(buffer, alpha=momentum) if group["nesterov"] else buffer

                update = zeropower_via_newton_schulz5(
                    direction,
                    steps=group["ns_steps"],
                    eps=group["eps"],
                )
                if group["match_rms_adamw"]:
                    rows, columns = parameter.shape
                    update.mul_(0.2 * math.sqrt(max(rows, columns)))

                parameter.mul_(1.0 - group["lr"] * group["weight_decay"])
                parameter.add_(update, alpha=-group["lr"])

        return loss


def verify_adamw_against_pytorch() -> None:
    """Compare a changing-gradient sequence against torch.optim.AdamW."""

    torch.manual_seed(336)
    ours_a = torch.randn(4, 3, dtype=torch.float64, requires_grad=True)
    ours_b = torch.randn(5, dtype=torch.float64, requires_grad=True)
    ref_a = ours_a.detach().clone().requires_grad_(True)
    ref_b = ours_b.detach().clone().requires_grad_(True)

    group_ours = [
        {"params": [ours_a], "lr": 3e-3, "weight_decay": 0.1},
        {"params": [ours_b], "lr": 8e-4, "weight_decay": 0.0},
    ]
    group_ref = [
        {"params": [ref_a], "lr": 3e-3, "weight_decay": 0.1},
        {"params": [ref_b], "lr": 8e-4, "weight_decay": 0.0},
    ]
    ours = AdamWFromScratch(group_ours, betas=(0.87, 0.96), eps=1e-9)
    reference = torch.optim.AdamW(
        group_ref,
        betas=(0.87, 0.96),
        eps=1e-9,
        foreach=False,
    )

    for step in range(20):
        generator = torch.Generator().manual_seed(10_000 + step)
        grad_a = torch.randn(ours_a.shape, generator=generator, dtype=torch.float64)
        grad_b = torch.randn(ours_b.shape, generator=generator, dtype=torch.float64)
        if step == 5:
            grad_a.zero_()  # zero is an update

        ours_a.grad = grad_a.clone()
        ref_a.grad = grad_a.clone()
        if step == 11:
            ours_b.grad = None  # None is skipped
            ref_b.grad = None
        else:
            ours_b.grad = grad_b.clone()
            ref_b.grad = grad_b.clone()

        ours.step()
        reference.step()

    torch.testing.assert_close(ours_a, ref_a, rtol=1e-12, atol=1e-12)
    torch.testing.assert_close(ours_b, ref_b, rtol=1e-12, atol=1e-12)


def inspect_muon_polar_factor() -> tuple[float, float]:
    """Return the smallest and largest singular values of an approximation."""

    torch.manual_seed(2026)
    matrix = torch.randn(48, 32, dtype=torch.float32)
    polar = zeropower_via_newton_schulz5(matrix)
    singular_values = torch.linalg.svdvals(polar.float())
    minimum = singular_values.min().item()
    maximum = singular_values.max().item()
    if not torch.isfinite(singular_values).all():
        raise AssertionError("Newton--Schulz approximation produced nonfinite values")
    if maximum - minimum > 0.45:
        raise AssertionError(
            "singular values were not sufficiently equalized: "
            f"min={minimum:.4f}, max={maximum:.4f}"
        )
    return minimum, maximum


def main() -> None:
    verify_adamw_against_pytorch()
    minimum, maximum = inspect_muon_polar_factor()
    print("AdamWFromScratch matches torch.optim.AdamW in float64.")
    print(
        "Muon Newton--Schulz output singular-value range: "
        f"[{minimum:.4f}, {maximum:.4f}]"
    )
    print("All self-checks passed.")


if __name__ == "__main__":
    main()
