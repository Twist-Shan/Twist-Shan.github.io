---
layout: studio
title: Research
permalink: /research/
slug: research
# Each resource below is optional. Empty values stay hidden and the remaining
# items automatically shift left in this order: synthetic, realistic, arXiv, blog, venue.
pareto_links:
  synthetic_repo: "https://github.com/Twist-Shan/Binary_Pairwise_Pareto_Syn"
  realistic_repo: "https://github.com/Twist-Shan/Binary_Pairwise_Pareto_Rea_Arena"
  arxiv:
  blog:
  venue_label:
  venue_url:
cot_links:
  synthetic_repo: "https://github.com/Twist-Shan/Synthetic_CoT_NiaH_Count"
  realistic_repo: "https://github.com/Twist-Shan/Realistic_CoT_NiaH_Count"
  arxiv:
  blog:
  venue_label:
  venue_url:
---

<header class="page-hero shell reveal">
  <p class="eyebrow">01 — Research</p>
  <h1>Questions I’m <em>interested in.</em></h1>
  <p>I’m a slow learner, but I keep learning and moving forward.</p>
</header>

<main class="research-catalog shell">
  <!-- Deep Learning is reserved as a future research direction and remains hidden until it has content. -->

  <section class="research-domain reveal" id="reinforcement-learning">
    <header class="research-domain-header">
      <p class="project-number">R / 01</p>
      <h2>Reinforcement Learning</h2>
      <i class="heading-mark heading-mark--rl" aria-hidden="true"></i>
    </header>

    <div class="research-track">
      <header class="research-track-header research-track-header--rl">
        <div class="research-track-title">
          <p>RL / Theory / Bandits Theory</p>
        </div>
      </header>

      <article class="research-entry" id="chatbot-arena-ranking">
        <h4>Pareto AI Identification</h4>
        <p class="research-description">We study Pareto-optimal set identification algorithm for evaluating models from human preferences, especially in AI Arena, through binary pairwise feedback bandits with Bradley-Terry model and Borda score successive elimination.</p>
        <div class="research-links">
          {% if page.pareto_links.synthetic_repo or page.pareto_links.realistic_repo or page.pareto_links.arxiv or page.pareto_links.blog or page.pareto_links.venue_label or page.pareto_links.venue_url %}
          <div class="research-resources">
            {% if page.pareto_links.synthetic_repo %}<a href="{{ page.pareto_links.synthetic_repo }}">Synthetic repo <span>↗</span></a>{% endif %}
            {% if page.pareto_links.realistic_repo %}<a href="{{ page.pareto_links.realistic_repo }}">Realistic repo <span>↗</span></a>{% endif %}
            {% if page.pareto_links.arxiv %}<a class="research-arxiv" href="{{ page.pareto_links.arxiv }}">arXiv <span>↗</span></a>{% endif %}
            {% if page.pareto_links.blog %}<a class="research-blog" href="{{ page.pareto_links.blog }}">Blog <span>↗</span></a>{% endif %}
            {% if page.pareto_links.venue_url %}<a class="research-venue" href="{{ page.pareto_links.venue_url }}">{% if page.pareto_links.venue_label %}{{ page.pareto_links.venue_label }}{% else %}Venue{% endif %} <span>↗</span></a>{% elsif page.pareto_links.venue_label %}<span class="research-venue">{{ page.pareto_links.venue_label }}</span>{% endif %}
          </div>
          {% endif %}
          <a class="research-advisor" href="https://zhimeir.github.io/">Advisor · Prof. Zhimei Ren <span>↗</span></a>
        </div>
      </article>
    </div>
  </section>

  <section class="research-domain reveal" id="large-language-model">
    <header class="research-domain-header">
      <p class="project-number">R / 02</p>
      <h2>Large Language Model</h2>
      <i class="heading-mark heading-mark--llm" aria-hidden="true"></i>
    </header>

    <div class="research-track">
      <header class="research-track-header research-track-header--llm">
        <div class="research-track-title">
          <p>LLM / Interpretability / Reasoning</p>
        </div>
      </header>

      <article class="research-entry" id="cot-counting-mechanism">
        <h4>CoT Mechanism for Counting</h4>
        <p class="research-description">We investigate how Chain-of-Thought improves LLMs'counting ability, by tracing the mechanism from controlled synthetic tasks on GPT-2 like Transformers to realistic needle-in-a-haystack settings in open-weight large model.</p>
        <div class="research-links">
          {% if page.cot_links.synthetic_repo or page.cot_links.realistic_repo or page.cot_links.arxiv or page.cot_links.blog or page.cot_links.venue_label or page.cot_links.venue_url %}
          <div class="research-resources">
            {% if page.cot_links.synthetic_repo %}<a href="{{ page.cot_links.synthetic_repo }}">Synthetic repo <span>↗</span></a>{% endif %}
            {% if page.cot_links.realistic_repo %}<a href="{{ page.cot_links.realistic_repo }}">Realistic repo <span>↗</span></a>{% endif %}
            {% if page.cot_links.arxiv %}<a class="research-arxiv" href="{{ page.cot_links.arxiv }}">arXiv <span>↗</span></a>{% endif %}
            {% if page.cot_links.blog %}<a class="research-blog" href="{{ page.cot_links.blog }}">Blog <span>↗</span></a>{% endif %}
            {% if page.cot_links.venue_url %}<a class="research-venue" href="{{ page.cot_links.venue_url }}">{% if page.cot_links.venue_label %}{{ page.cot_links.venue_label }}{% else %}Venue{% endif %} <span>↗</span></a>{% elsif page.cot_links.venue_label %}<span class="research-venue">{{ page.cot_links.venue_label }}</span>{% endif %}
          </div>
          {% endif %}
          <a class="research-advisor" href="https://pages.stat.wisc.edu/~zhong35/">Advisor · Prof. Yiqiao Zhong <span>↗</span></a>
        </div>
      </article>

      <aside class="research-aside">
        <p>We are also interested in the geometry and compression of hidden-state representations; some toy experiments are available in <a href="https://github.com/Twist-Shan/Hidden_State_Evaluation">Hidden State Evaluation <span>↗</span></a>.</p>
      </aside>
    </div>
  </section>
</main>
