/* Native teaching illustrations for the Non-thinking and Thinking pathways.
 * Shapes, record snippets, and particle positions are illustrative.
 * Every arrow denotes information flow; no attention-weight direction or fitted data is shown.
 */
(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const instances = [];
  let uid = 0;
  const texts = {
    direct: {
      title: 'Form, retrieve, consolidate: the Non-thinking pathway',
      overview: 'Record information passes through early representations and selected retrieval heads into a deeper answer state.',
      stages: ['Form', 'Retrieve', 'Consolidate'],
      descriptions: [
        'Early layers form contextual states at the full record spans.',
        'Selected middle-layer heads gather information from several records at the answer query.',
        'Deeper computation at that same query position forms a state that influences the count.'
      ]
    },
    thinking: {
      title: 'Retrieve, update, read: the Thinking pathway',
      overview: 'Each completed item can guide another retrieval; the whole completed trace supports the final answer.',
      stages: ['Retrieve', 'Update', 'Read'],
      descriptions: [
        'The prior completed-item state guides a query that retrieves information from the next full prompt record.',
        'Generating a new item forms a completed-item state that can guide the next retrieval.',
        'The model uses the completed trace to produce the final count.'
      ]
    }
  };

  function create(host) {
    const mode = host.dataset.pathway;
    if (!texts[mode] || host.dataset.pathwayReady === 'true') return;
    host.dataset.pathwayReady = 'true';
    host.dataset.active = 'false';
    const id = `pv-${mode}-${++uid}`;
    const copy = texts[mode];
    let stage = -1;
    let touched = false;
    const t = (x, y, value, cls = '', anchor = 'start') => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${value}</text>`;
    const part = (indexes, role, contents) => `<g class="pv-part pv-role-${role}${indexes.includes(stage) ? ' pv-selected' : ''}" data-pv-stages="${indexes.join(',')}">${contents}</g>`;
    const math = (base, sub, size = 15) => `${base}<tspan baseline-shift="sub" font-size="${size}">${sub}</tspan>`;
    const edge = (d, role, functional = false, arrow = true) => `<path d="${d}" class="pv-edge${functional ? ' pv-functional' : ''}"${arrow ? ` marker-end="url(#${id}-arrow-${role})"` : ''}/>`;
    const particle = (d, role, active) => touched && active && !reducedMotion.matches ? `<circle r="2.6" class="pv-particle pv-role-${role}"><animateMotion path="${d}" dur="1.7s" repeatCount="2" fill="remove"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.85;1" dur="3.4s" fill="freeze"/></circle>` : '';
    const stateNode = (x, y, label, role, radius = 25) => `<g class="pv-role-${role}"><circle cx="${x}" cy="${y}" r="${radius + 12}" class="pv-node-halo"/><ellipse cx="${x}" cy="${y}" rx="${radius + 5}" ry="${radius + 12}" transform="rotate(-32 ${x} ${y})" class="pv-node-orbit"/><circle cx="${x}" cy="${y}" r="${radius}" class="pv-node-disc"/>${t(x, y + 6, label, `pv-math pv-node-math pv-${role}-text`, 'middle')}</g>`;
    const record = (x, y, city, score, label, small = false) => {
      const width = small ? 121 : 150;
      return `<g class="pv-role-prompt">${label ? t(x, y - 16, label, 'pv-label-quiet pv-prompt-text') : ''}<path d="M${x} ${y - 5}h${width * .7}M${x} ${y + 38}h${width}M${x} ${y + 46}h${width * .82}" class="pv-record-line"/><path d="M${x - 3} ${y + 23}h${city.length * 10 + 6}" stroke="var(--pv-needle)" stroke-width="11" stroke-linecap="round" opacity=".26"/>${t(x, y + 24, `${city}<tspan class="pv-caption"> · ${score}</tspan>`, 'pv-city')}</g>`;
    };
    const defs = () => `<title id="${id}-title">${copy.title}</title><desc id="${id}-desc">${copy.overview} All arrows show information flow. This is an illustrative functional synthesis, not a measured complete circuit.</desc><defs>${['prompt','trace','answer'].map(role => `<marker id="${id}-arrow-${role}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M1 1 7 4 1 7" fill="none" stroke="var(--pv-${role})" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"/></marker>`).join('')}</defs>`;

    function direct() {
      const ys = [93, 179, 265];
      let s = defs();
      s += t(36, 27, 'PROMPT RECORDS', 'pv-label');
      s += t(303, 27, 'EARLY STATES', 'pv-label', 'middle');
      s += t(559, 27, 'SELECTED HEADS', 'pv-label', 'middle');
      s += t(761, 27, 'DEEP STATE', 'pv-label', 'middle');
      let formed = '';
      [['Paris','92'],['Vienna','73'],['Tokyo','88']].forEach(([city,score],i) => {
        formed += record(36, ys[i] - 22, city, score, '', false);
        const flow = `M205 ${ys[i] + 2}H266`;
        formed += edge(flow, 'prompt');
        formed += stateNode(302, ys[i] + 2, math('h', `N${i + 1}`, 11), 'prompt', 23);
        formed += particle(flow, 'prompt', stage === 0 && i === 1);
      });
      s += part([0], 'prompt', formed);
      // The bank glyph is symbolic: its marks do not specify the number of empirical heads.
      let retrieve = '';
      ys.forEach((y, i) => {
        const d = `M337 ${y + 2}C427 ${y + 2} 453 181 526 181`;
        retrieve += edge(d, 'prompt') + particle(d, 'prompt', stage === 1 && i !== 1);
      });
      retrieve += '<path d="M509 149V139H609V149M509 213V223H609V213" class="pv-guide-line"/>';
      retrieve += '<g class="pv-role-prompt"><rect x="531" y="155" width="56" height="53" rx="13" fill="var(--pv-prompt)" opacity=".05"/>';
      [0,1,2].forEach(i => [0,1].forEach(j => { retrieve += `<rect x="${538 + i * 16}" y="${163 + j * 19}" width="10" height="12" rx="3" fill="currentColor" opacity="${.32 + .13 * ((i+j)%2)}"/>`; }));
      retrieve += '</g>';
      retrieve += t(559, 255, 'broad retrieval', 'pv-caption pv-prompt-text', 'middle');
      retrieve += t(559, 275, 'at the answer query', 'pv-caption', 'middle');
      s += part([1], 'prompt', retrieve);
      const gather = 'M604 181H724', readout = 'M797 181H850';
      s += part([2], 'answer', edge(gather, 'answer') + stateNode(760, 181, math('a','T'), 'answer', 26) + edge(readout, 'answer') + t(903, 189, 'Total: …', 'pv-count pv-answer-text', 'middle') + t(760, 255, 'answer state', 'pv-caption pv-answer-text', 'middle') + particle(gather, 'answer', stage === 2));
      s += '<path d="M518 305H798" class="pv-guide-line"/>';
      s += t(658, 326, 'same answer-query position · deeper computation →', 'pv-label-quiet', 'middle');
      return s;
    }

    function thinking() {
      let s = defs();
      // Content comes from a full record span; the query is a later generated-token position.
      s += part([0], 'prompt', record(218, 39, 'Tokyo', '88', 'PROMPT RECORD Nₖ', true) + edge('M277 97V151', 'prompt') + t(319, 128, 'retrieve', 'pv-caption pv-prompt-text') + particle('M277 97V151', 'prompt', stage === 0));
      const guide = 'M111 185H245';
      s += part([0], 'trace', stateNode(77,185,math('H','k−1',12),'trace') + t(77,245,'… Vienna …','pv-city pv-trace-text','middle') + t(77,267,'prior completed item','pv-caption','middle') + edge(guide,'trace',true) + t(178,167,'guide','pv-caption','middle') + stateNode(277,185,math('q','k'),'trace',24) + t(277,237,'before the next','pv-caption','middle') + t(277,255,'city mention','pv-caption','middle') + particle(guide,'trace',stage === 0));
      const write = 'M311 185H406', update = 'M487 185H552';
      let updatePart = edge(write,'trace') + t(448,168,math('e','k'),'pv-math pv-trace-text','middle');
      updatePart += '<path d="M415 210H481" stroke="var(--pv-trace)" stroke-width="1.1" opacity=".45"/>';
      updatePart += t(448,195,'Tokyo','pv-city pv-trace-text','middle');
      updatePart += t(360,168,'write','pv-caption','middle');
      updatePart += edge(update,'trace',true) + stateNode(587,185,math('H','k'),'trace');
      updatePart += t(587,237,'new completed','pv-caption','middle') + t(587,255,'item state','pv-caption','middle');
      const onward = 'M623 185H706';
      updatePart += edge(onward,'trace',true) + stateNode(738,185,math('q','k+1',12),'trace',26);
      updatePart += t(665,167,'guide','pv-caption','middle') + t(738,241,'repeat','pv-caption pv-trace-text','middle');
      updatePart += '<path d="M773 185h24" class="pv-guide-line" stroke-dasharray="2 6"/>';
      updatePart += t(511,111,'UPDATE','pv-label pv-trace-text','middle');
      updatePart += '<path d="M399 130V121H623V130" class="pv-guide-line"/>';
      updatePart += particle(write,'trace',stage === 1) + particle(onward,'trace',stage === 1);
      s += part([1], 'trace', updatePart);
      const read = 'M792 293H844V185H867';
      let readPart = edge('M42 282V293H792V282','answer',false,false) + edge(read,'answer');
      readPart += t(413,325,'whole completed trace · H₁ … Hₙ','pv-caption pv-answer-text','middle');
      readPart += stateNode(899,185,math('a','T'),'answer',24) + edge('M899 151V108','answer');
      readPart += t(899,80,'Total: …','pv-count pv-answer-text','middle') + t(899,245,'answer state','pv-caption pv-answer-text','middle');
      readPart += particle(read,'answer',stage === 2);
      s += part([2], 'answer', readPart);
      return s;
    }

    host.innerHTML = `<div class="pv-scroll" tabindex="0" aria-label="${copy.title}. Scroll horizontally on small screens."><svg class="pv-svg" viewBox="0 0 960 350" role="img" aria-labelledby="${id}-title ${id}-desc"></svg></div><span class="pv-scroll-hint">Follow the pathway horizontally →</span><div class="pv-footer"><div class="pv-stages" role="group" aria-label="Highlight a functional stage">${copy.stages.map((label,index) => `<button type="button" class="pv-stage" data-stage="${index}" aria-pressed="false" aria-label="Highlight ${label.toLowerCase()}; select again for the full pathway">${label}</button>`).join('')}</div><button type="button" class="pv-next" aria-label="Highlight the next stage"><span>Next step</span><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h13m-5-5 5 5-5 5"/></svg></button></div><p class="pv-description" aria-live="polite" aria-atomic="true">${copy.overview}</p>`;
    const render = () => {
      host.dataset.active = String(stage !== -1);
      host.dataset.stage = stage === -1 ? 'overview' : copy.stages[stage].toLowerCase();
      host.querySelector('.pv-svg').innerHTML = mode === 'direct' ? direct() : thinking();
      host.querySelectorAll('.pv-stage').forEach((button,index) => button.setAttribute('aria-pressed', String(index === stage)));
      host.querySelector('.pv-description').textContent = stage === -1 ? copy.overview : copy.descriptions[stage];
      host.querySelector('.pv-next span').textContent = stage === 2 ? 'See all' : 'Next step';
      host.querySelector('.pv-next').setAttribute('aria-label', stage === 2 ? 'Show the full pathway' : 'Highlight the next stage');
    };
    const panToStage = () => {
      const viewport = host.querySelector('.pv-scroll');
      const overflow = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      if (overflow < 1) return;
      const positions = mode === 'direct' ? [0, .55, 1] : [0, .6, 1];
      viewport.scrollTo({
        left: stage === -1 ? 0 : Math.round(overflow * positions[stage]),
        behavior: reducedMotion.matches ? 'auto' : 'smooth'
      });
    };
    const select = value => { stage = value; touched = true; render(); panToStage(); };
    host.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button || !host.contains(button)) return;
      if (button.classList.contains('pv-stage')) {
        const next = Number(button.dataset.stage);
        select(stage === next ? -1 : next);
      } else if (button.classList.contains('pv-next')) select(stage === 2 ? -1 : stage + 1);
    });
    host.addEventListener('keydown', event => {
      if (!event.target.closest('.pv-footer') || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); select(stage === 2 ? -1 : stage + 1); }
      else if (event.key === 'ArrowLeft') { event.preventDefault(); select(stage === -1 ? 2 : stage - 1); }
      else if (event.key === 'Escape' || event.key === 'Home') { event.preventDefault(); select(-1); }
    });
    render();
    instances.push({
      reset() { stage = -1; touched = false; render(); panToStage(); },
      stopMotion() {
        host.querySelectorAll('.pv-particle').forEach(particle => particle.remove());
        const viewport = host.querySelector('.pv-scroll');
        viewport.scrollTo({ left: viewport.scrollLeft, behavior: 'auto' });
      }
    });
  }
  function init() { document.querySelectorAll('.pathway-visual[data-pathway]').forEach(create); }
  reducedMotion.addEventListener('change', event => {
    if (event.matches) instances.forEach(instance => instance.stopMotion());
  });
  window.PathwayVisuals = Object.freeze({ reset: () => instances.forEach(instance => instance.reset()), init });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
