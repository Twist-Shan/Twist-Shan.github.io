---
layout: studio
title: Research
permalink: /research/
slug: research
---

<header class="page-hero shell reveal">
  <p class="eyebrow">01 — Research</p>
  <h1>Questions I’m <em>interested in.</em></h1>
  <p>I’m a slow learner, but I keep learning and moving forward.</p>
</header>

<main class="research-catalog shell">
  {% for domain in site.data.research.domains %}
  <section class="research-domain reveal" id="{{ domain.id }}">
    <header class="research-domain-header">
      <p class="project-number">{{ domain.number }}</p>
      <h2>{{ domain.title }}</h2>
      <i class="heading-mark heading-mark--{{ domain.mark }}" aria-hidden="true">
        {% if domain.mark == "llm" %}
          <svg class="heading-mark-svg heading-mark-svg--llm" viewBox="0 0 88 88" focusable="false">
            <path class="mark-attention mark-attention--accent" d="M14 32 C24 7 36 7 44 32" />
            <path class="mark-attention mark-attention--mint" d="M44 32 C53 12 66 12 74 32" />
            <path class="mark-transfer" d="M14 39 L10 55 M44 39 L33 55 M44 39 L55 55 M74 39 L78 55" />
            <rect class="mark-node mark-node--ink mark-node--attention" x="7" y="25" width="14" height="14" />
            <rect class="mark-node mark-node--accent mark-node--attention" x="37" y="25" width="14" height="14" />
            <rect class="mark-node mark-node--mint mark-node--attention" x="67" y="25" width="14" height="14" />
            <circle class="mark-dot mark-dot--accent" cx="14" cy="32" r="2.2" />
            <circle class="mark-dot mark-dot--mint" cx="44" cy="32" r="2.2" />
            <circle class="mark-dot mark-dot--accent" cx="74" cy="32" r="2.2" />
            <path class="mark-chain mark-chain--stream" d="M10 65 C18 58 25 58 33 65 C40 72 48 72 55 65 C63 58 70 58 78 65" />
            <rect class="mark-node mark-node--ink" x="0" y="55" width="20" height="20" />
            <rect class="mark-node mark-node--accent" x="23" y="55" width="20" height="20" />
            <rect class="mark-node mark-node--mint" x="45" y="55" width="20" height="20" />
            <rect class="mark-node mark-node--ink" x="68" y="55" width="20" height="20" />
            <circle class="mark-dot mark-dot--accent" cx="10" cy="65" r="3" />
            <circle class="mark-dot mark-dot--mint" cx="33" cy="65" r="3" />
            <circle class="mark-dot mark-dot--accent" cx="55" cy="65" r="3" />
            <circle class="mark-dot mark-dot--mint" cx="78" cy="65" r="3" />
          </svg>
        {% elsif domain.mark == "dlm" %}
          <svg class="heading-mark-svg heading-mark-svg--dlm" viewBox="0 0 88 88" focusable="false">
            <path class="mark-wave mark-wave--accent mark-wave--soft" d="M-8 23 C4 13 15 12 27 21 C39 31 51 31 63 22 C76 12 91 13 104 24" />
            <path class="mark-wave mark-wave--ink" d="M-8 43 C5 32 17 31 29 41 C41 51 52 53 64 43 C78 31 92 32 104 42" />
            <path class="mark-wave mark-wave--mint" d="M-8 62 C4 56 11 43 24 41 C39 39 44 58 55 59 C67 60 72 37 84 35 C95 34 102 40 106 47" />
            <path class="mark-wave mark-wave--accent" d="M-8 80 C4 75 10 60 23 58 C35 56 42 71 52 74 C64 78 69 61 78 54 C88 47 99 52 106 62" />
            <path class="mark-wave mark-wave--mint mark-wave--fine" d="M64 67 C70 56 77 48 85 49 C93 50 96 57 92 62 C88 66 82 62 84 57" />
            <path class="mark-wave mark-wave--ink mark-wave--fine" d="M14 64 C20 56 27 53 35 56 M20 71 C27 63 35 62 42 66" />
            <circle class="mark-bubble mark-bubble--accent" cx="13" cy="9" r="3" />
            <circle class="mark-bubble mark-bubble--mint" cx="26" cy="20" r="1.8" />
            <circle class="mark-bubble mark-bubble--mint" cx="71" cy="9" r="4" />
            <circle class="mark-bubble mark-bubble--accent" cx="82" cy="28" r="2.4" />
            <circle class="mark-bubble mark-bubble--ink" cx="58" cy="79" r="2" />
          </svg>
        {% endif %}
      </i>
    </header>

    <div class="research-track">
      {% for track in domain.tracks %}
      <header class="research-track-header research-track-header--{{ domain.mark }}">
        <div class="research-track-title">
          <p>{{ track.label }}</p>
        </div>
      </header>

        {% for project in track.projects %}
          {% include research-project.html project=project %}
        {% endfor %}
      {% endfor %}

      {% if domain.aside %}
      <aside class="research-aside">
        <p>
          {{ domain.aside.before }}
          {% if domain.aside.link_url %}<a href="{{ domain.aside.link_url }}">{{ domain.aside.link_label }} <span>↗</span></a>{% endif %}{{ domain.aside.after }}
        </p>
      </aside>
      {% endif %}
    </div>
  </section>
  {% endfor %}
</main>
