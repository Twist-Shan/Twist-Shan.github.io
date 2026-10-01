/* Render the two counting laws with the same local KaTeX used by the Pareto blog. */
(() => {
  const equations = {
    'broad': String.raw`B_h = M_h\,\frac{\exp(H_h)}{N}`,
    'targeted': String.raw`T_h(q_k,S_k)=\sum_{s\in S_k} A_h(q_k,s)`,
    'non-thinking': String.raw`p \approx 2\Phi\!\left(\frac{1}{2N\sigma(1,L)}\right)-1`,
    'thinking': String.raw`p \approx (1-\alpha)(1-\gamma_L)^N`
  };
  document.querySelectorAll('[data-count-equation]').forEach(element => {
    if (window.katex) katex.render(equations[element.dataset.countEquation], element, {
      displayMode: true, throwOnError: false, output: 'htmlAndMathml'
    });
  });
})();
