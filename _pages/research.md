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
      <i class="heading-mark heading-mark--{{ domain.mark }}" aria-hidden="true"></i>
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
