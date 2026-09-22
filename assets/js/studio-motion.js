(() => {
  const root = document.documentElement;
  const marks = [...document.querySelectorAll('.heading-mark--research')];
  const names = [...document.querySelectorAll('.motion-name, .motion-title')];
  if (!marks.length && !names.length) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const button = document.querySelector('.motion-toggle');
  const period = parseFloat(getComputedStyle(root).getPropertyValue('--research-motion-period')) * 1000 || 8000;
  let paused = false;
  try { paused = localStorage.getItem('liang-motion') === 'paused'; } catch (_) {}

  const orbits = marks.flatMap(mark => [...mark.querySelectorAll('[data-orbit-phase]')].map(node => ({
    mark, node, phase: Number(node.dataset.orbitPhase),
    x: Number(node.dataset.orbitX), y: Number(node.dataset.orbitY)
  })));
  const waves = marks.flatMap(mark => [...mark.querySelectorAll('[data-wave]')].map(node => {
    const original = node.getAttribute('d');
    const numbers = original.match(/-?\d*\.?\d+/g).map(Number);
    const end = numbers.length - 2;
    return {
      mark, node, original,
      fromX: numbers[0], fromY: numbers[1], toX: numbers[end], toY: numbers[end + 1],
      offset: Number(node.dataset.wavePhase) || 0,
      amplitude: Number(node.dataset.waveAmplitude) || 6
    };
  }));
  const packets = marks.flatMap(mark => [...mark.querySelectorAll('[data-packet]')].map(node => {
    const path = mark.querySelector(`[data-packet-route="${node.dataset.packet}"]`);
    return { mark, node, path, length: path.getTotalLength(), delay: Number(node.dataset.packetDelay) };
  }));
  const nameFields = names.map(node => ({ node, x: 0, y: 0, targetX: 0, targetY: 0, rest: 1, moving: false, initialized: false, returning: false }));
  const visible = element => element.classList.contains('is-motion-visible');
  const stopped = () => paused || reducedMotion.matches || document.hidden;
  const hasWork = () => orbits.some(item => visible(item.mark)) || waves.some(item => visible(item.mark)) || packets.some(item => visible(item.mark)) || nameFields.some(item => item.moving && visible(item.node));
  let frame = 0;
  let previousTime = 0;
  let elapsed = 0;
  const tilt = -35 * Math.PI / 180;

  function startFrame() {
    if (!frame && !stopped() && hasWork()) frame = requestAnimationFrame(animate);
  }

  function animate(time) {
    frame = 0;
    if (stopped()) return;
    const delta = previousTime ? Math.min(time - previousTime, 100) : 16;
    previousTime = time;
    elapsed += delta;
    const phase = (elapsed % period) / period;
    // RL keeps its original 16-second full orbit (two shared 8-second beats).
    const orbitAngle = elapsed / (period * 2) * Math.PI * 2;
    orbits.forEach(({ mark, node, phase: offset, x, y }) => {
      if (!visible(mark)) return;
      const theta = orbitAngle + offset;
      const nextX = 44 + 31 * Math.cos(theta) * Math.cos(tilt) - 17 * Math.sin(theta) * Math.sin(tilt);
      const nextY = 44 + 31 * Math.cos(theta) * Math.sin(tilt) + 17 * Math.sin(theta) * Math.cos(tilt);
      node.setAttribute('transform', `translate(${(nextX - x).toFixed(3)} ${(nextY - y).toFixed(3)})`);
    });

    // Traveling waves keep their shape as crests move from left to right.
    // Cubic segments match both the height and slope at each join.
    waves.forEach(({ mark, node, fromX, fromY, toX, toY, offset, amplitude }) => {
      if (!visible(mark)) return;
      const slope = (toY - fromY) / (toX - fromX);
      const frequency = Math.PI * 2 / 72;
      const sample = x => {
        const angle = (x - fromX) * frequency + (offset - phase) * Math.PI * 2;
        return {
          y: fromY + (x - fromX) * slope - amplitude * (Math.sin(angle) + .12 * Math.sin(2 * angle + .4)),
          slope: slope - amplitude * frequency * (Math.cos(angle) + .24 * Math.cos(2 * angle + .4))
        };
      };
      const step = (toX - fromX) / 12;
      let x = fromX;
      let point = sample(x);
      let d = `M${x} ${point.y.toFixed(3)}`;
      for (let i = 1; i <= 12; i++) {
        const nextX = fromX + i * step;
        const next = sample(nextX);
        d += `C${(x + step / 3).toFixed(3)} ${(point.y + point.slope * step / 3).toFixed(3)} ${
          (nextX - step / 3).toFixed(3)} ${(next.y - next.slope * step / 3).toFixed(3)} ${nextX.toFixed(3)} ${next.y.toFixed(3)}`;
        x = nextX;
        point = next;
      }
      node.setAttribute('d', d);
    });

    packets.forEach(({ mark, node, path, length, delay }) => {
      if (!visible(mark)) return;
      const progress = ((phase - delay + 1) % 1) / .28;
      if (progress > 1) { node.style.opacity = '0'; return; }
      const point = path.getPointAtLength(length * progress);
      node.setAttribute('transform', `translate(${point.x.toFixed(3)} ${point.y.toFixed(3)})`);
      node.style.opacity = String(Math.min(1, progress * 8, (1 - progress) * 8));
    });

    nameFields.forEach(field => {
      if (!field.moving || !visible(field.node)) return;
      const follow = 1 - Math.exp(-delta / (field.returning ? 150 : 95));
      field.x += (field.targetX - field.x) * follow;
      field.y += (field.targetY - field.y) * follow;
      const distance = Math.abs(field.targetX - field.x) + Math.abs(field.targetY - field.y);
      // Blend into the emphasized text only once the moving color is close to it.
      const targetRest = field.returning && distance < 24 ? 1 : 0;
      field.rest += (targetRest - field.rest) * follow;
      field.moving = distance > .15 || Math.abs(targetRest - field.rest) > .002;
      if (!field.moving) {
        field.x = field.targetX;
        field.y = field.targetY;
        field.rest = targetRest;
      }
      field.node.style.setProperty('--name-x', `${field.x.toFixed(2)}px`);
      field.node.style.setProperty('--name-y', `${field.y.toFixed(2)}px`);
      field.node.style.setProperty('--name-rest', `${(field.rest * 100).toFixed(3)}%`);
      if (!field.moving && field.returning) resetNameHighlight(field);
    });
    if (hasWork()) startFrame();
    else previousTime = 0;
  }

  function resetNameHighlight(field) {
    field.moving = false;
    field.initialized = false;
    field.returning = false;
    field.rest = 1;
    field.node.classList.remove('is-name-following');
    field.node.style.removeProperty('--name-x');
    field.node.style.removeProperty('--name-y');
    field.node.style.removeProperty('--name-rest');
  }

  function returnNameHighlight(field) {
    if (!field.initialized) return;
    if (stopped()) { resetNameHighlight(field); return; }
    const rect = field.node.getBoundingClientRect();
    const nickname = (field.node.querySelector('em') || field.node).getBoundingClientRect();
    field.targetX = nickname.left - rect.left + nickname.width / 2;
    field.targetY = nickname.top - rect.top + nickname.height / 2;
    field.returning = true;
    field.moving = true;
    // Keep the same gradient visible until it reaches the emphasized text.
    startFrame();
  }

  nameFields.forEach(field => {
    field.node.addEventListener('pointermove', event => {
      if (stopped() || event.pointerType === 'touch') return;
      const rect = field.node.getBoundingClientRect();
      if (!field.initialized) {
        const nickname = (field.node.querySelector('em') || field.node).getBoundingClientRect();
        field.x = nickname.left - rect.left + nickname.width / 2;
        field.y = nickname.top - rect.top + nickname.height / 2;
        field.node.style.setProperty('--name-x', `${field.x.toFixed(2)}px`);
        field.node.style.setProperty('--name-y', `${field.y.toFixed(2)}px`);
        field.initialized = true;
      }
      field.node.classList.add('is-name-following');
      field.returning = false;
      field.targetX = event.clientX - rect.left;
      field.targetY = event.clientY - rect.top;
      field.moving = true;
      startFrame();
    }, { passive: true });
    field.node.addEventListener('pointerleave', () => returnNameHighlight(field));
    field.node.addEventListener('pointercancel', () => returnNameHighlight(field));
  });

  function syncMotion() {
    root.dataset.motion = stopped() ? 'paused' : 'playing';
    if (button) {
      button.hidden = false;
      button.disabled = reducedMotion.matches;
      const label = reducedMotion.matches ? 'Animations disabled by system preference' : paused ? 'Play animations' : 'Pause animations';
      button.setAttribute('aria-label', label);
      button.title = label;
    }
    if (reducedMotion.matches) {
      orbits.forEach(({ node }) => node.removeAttribute('transform'));
      waves.forEach(({ node, original }) => node.setAttribute('d', original));
      packets.forEach(({ node }) => { node.style.opacity = '0'; });
      nameFields.forEach(resetNameHighlight);
    }
    if (stopped() || !hasWork()) {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    } else startFrame();
  }

  root.classList.add('motion-ready');
  syncMotion();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('is-motion-visible', entry.isIntersecting));
      syncMotion();
    }, { threshold: 0 });
    [...marks, ...names].forEach(element => observer.observe(element));
  } else {
    [...marks, ...names].forEach(element => element.classList.add('is-motion-visible'));
    syncMotion();
  }

  button?.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('liang-motion', paused ? 'paused' : 'playing'); } catch (_) {}
    syncMotion();
  });
  reducedMotion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
})();
