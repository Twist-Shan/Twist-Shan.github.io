"""A small, readable byte-level BPE tokenizer.

This is study code, not a production-speed tokenizer.  It deliberately mirrors
the progression used by Stanford CS336 and Andrej Karpathy's minBPE:

    regex pre-tokenization -> UTF-8 bytes -> ranked BPE merges -> token ids

Install the only non-stdlib dependency with:  pip install regex
Run the self-checks with:                         python tokenization_bpe_from_scratch.py
"""

from __future__ import annotations

from collections import Counter
from collections.abc import Collection, Iterable, Sequence
from dataclasses import dataclass, field
from typing import Literal

import regex


# GPT-2-inspired, intentionally readable. Modern GPT tokenizers use different
# patterns, especially for numbers and whitespace. The pattern is part of the
# tokenizer model and must be identical at training and inference time.
GPT2_PATTERN = regex.compile(
    r"""'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+"""
)

Pair = tuple[int, int]
OrderedMerge = tuple[Pair, int]  # ((left_id, right_id), new_id)


def merge_pair(ids: Sequence[int], pair: Pair, new_id: int) -> tuple[int, ...]:
    """Replace non-overlapping occurrences of pair, scanning left-to-right."""
    out: list[int] = []
    i = 0
    while i < len(ids):
        if i + 1 < len(ids) and (ids[i], ids[i + 1]) == pair:
            out.append(new_id)
            i += 2
        else:
            out.append(ids[i])
            i += 1
    return tuple(out)


def split_on_special(text: str, special_tokens: Collection[str]) -> list[str]:
    """Split text while retaining allowed special-token strings as parts."""
    if not special_tokens:
        return [text]
    # Longest first makes overlapping reserved strings deterministic.
    alternatives = "|".join(
        regex.escape(token) for token in sorted(special_tokens, key=len, reverse=True)
    )
    return regex.split(f"({alternatives})", text)


def pretokenize(text: str) -> list[str]:
    """Split text into chunks across which BPE is forbidden to merge."""
    pieces = GPT2_PATTERN.findall(text)
    assert "".join(pieces) == text, "pre-tokenizer failed to cover the input"
    return pieces


@dataclass(slots=True)
class ByteBPE:
    """The learned tokenizer state: vocabulary, ordered merges, special ids."""

    vocab: dict[int, bytes]
    ordered_merges: list[OrderedMerge]
    special_to_id: dict[str, int]
    _rule: dict[Pair, tuple[int, int]] = field(init=False, repr=False)

    def __post_init__(self) -> None:
        # pair -> (rank, new_id). Lower rank means the merge was learned earlier.
        self._rule = {
            pair: (rank, new_id)
            for rank, (pair, new_id) in enumerate(self.ordered_merges)
        }

    def _encode_piece(self, piece: str) -> list[int]:
        ids = list(piece.encode("utf-8"))
        while len(ids) >= 2:
            candidates = {
                pair for pair in zip(ids, ids[1:]) if pair in self._rule
            }
            if not candidates:
                break
            # Encoding follows learned rank; it does NOT recount frequencies.
            pair = min(candidates, key=lambda candidate: self._rule[candidate][0])
            new_id = self._rule[pair][1]
            ids = list(merge_pair(ids, pair, new_id))
        return ids

    def encode(
        self,
        text: str,
        *,
        allowed_special: Collection[str] | Literal["all"] = (),
    ) -> list[int]:
        """Encode text. Reserved strings are controls only when explicitly allowed."""
        if allowed_special == "all":
            allowed = set(self.special_to_id)
        else:
            if isinstance(allowed_special, str):
                raise TypeError(
                    'allowed_special must be "all" or a collection of full tokens'
                )
            allowed = set(allowed_special)
            unknown = allowed.difference(self.special_to_id)
            if unknown:
                raise ValueError(f"unknown special tokens: {sorted(unknown)!r}")

        output: list[int] = []
        for part in split_on_special(text, allowed):
            if part in allowed:
                output.append(self.special_to_id[part])
            else:
                for piece in pretokenize(part):
                    output.extend(self._encode_piece(piece))
        return output

    def decode_bytes(self, ids: Iterable[int]) -> bytes:
        return b"".join(self.vocab[token_id] for token_id in ids)

    def decode(self, ids: Iterable[int], *, errors: str = "strict") -> str:
        # A single token need not be valid UTF-8; join token bytes before decoding.
        return self.decode_bytes(ids).decode("utf-8", errors=errors)

    def bytes_per_token(self, text: str) -> float:
        ids = self.encode(text)
        return len(text.encode("utf-8")) / max(len(ids), 1)


def train_byte_bpe(
    text: str,
    *,
    num_merges: int,
    special_tokens: Sequence[str] = ("<|endoftext|>",),
) -> ByteBPE:
    """Train a pedagogical byte-level BPE tokenizer by repeated full rescans.

    Repeated pre-tokens are collapsed into a Counter, so pair counts are weighted
    by occurrence frequency. Ties use lexicographically larger token byte strings;
    any deterministic policy is valid, but it must be specified for reproducibility.
    """
    if num_merges < 0:
        raise ValueError("num_merges must be non-negative")
    if any(token == "" for token in special_tokens):
        raise ValueError("special tokens must be non-empty")
    if len(set(special_tokens)) != len(special_tokens):
        raise ValueError("special tokens must be unique")

    vocab: dict[int, bytes] = {i: bytes([i]) for i in range(256)}
    piece_counts: Counter[tuple[int, ...]] = Counter()

    for part in split_on_special(text, special_tokens):
        if part in special_tokens:
            continue  # Control strings neither contribute pairs nor get merged.
        for piece in pretokenize(part):
            piece_counts[tuple(piece.encode("utf-8"))] += 1

    ordered_merges: list[OrderedMerge] = []
    for _ in range(num_merges):
        pair_counts: Counter[Pair] = Counter()
        for ids, frequency in piece_counts.items():
            for pair in zip(ids, ids[1:]):
                pair_counts[pair] += frequency
        if not pair_counts:
            break

        pair = max(
            pair_counts,
            key=lambda candidate: (
                pair_counts[candidate],
                vocab[candidate[0]],
                vocab[candidate[1]],
            ),
        )
        new_id = len(vocab)
        vocab[new_id] = vocab[pair[0]] + vocab[pair[1]]
        ordered_merges.append((pair, new_id))

        updated: Counter[tuple[int, ...]] = Counter()
        for ids, frequency in piece_counts.items():
            updated[merge_pair(ids, pair, new_id)] += frequency
        piece_counts = updated

    next_id = len(vocab)
    special_to_id = {
        token: next_id + offset for offset, token in enumerate(special_tokens)
    }
    for token, token_id in special_to_id.items():
        vocab[token_id] = token.encode("utf-8")

    return ByteBPE(vocab, ordered_merges, special_to_id)


def _self_test() -> None:
    toy = train_byte_bpe("aaabdaaabac", num_merges=3, special_tokens=())
    assert toy.ordered_merges == [
        ((97, 97), 256),
        ((256, 97), 257),
        ((257, 98), 258),
    ]
    assert toy.encode("aaabdaaabac") == [258, 100, 258, 97, 99]
    assert toy.decode(toy.encode("aaabdaaabac")) == "aaabdaaabac"
    assert toy.decode(toy.encode("")) == ""

    boundary_model = train_byte_bpe("a b", num_merges=10, special_tokens=())
    assert b"a " not in boundary_model.vocab.values()

    corpus = ("hello123!!!? (안녕하세요!) 😉 你好，tokenization!\n" * 8)
    tokenizer = train_byte_bpe(corpus, num_merges=80)
    sample = "Hello, 世界! 안녕하세요 😉\n"
    assert tokenizer.decode(tokenizer.encode(sample)) == sample

    control = "<|endoftext|>hello"
    ordinary_ids = tokenizer.encode(control)  # reserved string remains ordinary text
    control_ids = tokenizer.encode(control, allowed_special="all")
    assert control_ids[0] == tokenizer.special_to_id["<|endoftext|>"]
    assert tokenizer.decode(ordinary_ids) == control
    assert tokenizer.decode(control_ids) == control

    try:
        tokenizer.encode("x", allowed_special={"<|unknown|>"})
    except ValueError:
        pass
    else:
        raise AssertionError("unknown special token should fail")

    try:
        train_byte_bpe("x", num_merges=0, special_tokens=("",))
    except ValueError:
        pass
    else:
        raise AssertionError("empty special token should fail")

    assert tokenizer.decode_bytes([0xE4]) == b"\xe4"
    try:
        tokenizer.decode([0xE4])
    except UnicodeDecodeError:
        pass
    else:
        raise AssertionError("a partial UTF-8 token should fail strict decoding")

    print("All byte-BPE self-checks passed.")
    print("toy ids:", toy.encode("aaabdaaabac"))
    print("sample bytes/token:", round(tokenizer.bytes_per_token(sample), 3))


if __name__ == "__main__":
    _self_test()
