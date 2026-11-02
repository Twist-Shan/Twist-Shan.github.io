---
layout: studio
title: Research
permalink: /research/
slug: research
---
<section class="page" id="research"><header class="page-title"><p class="kicker">01 / Research</p><h1 class="motion-title">Questions I’m <em>interested in.</em></h1><p>I’m a slow learner, but I keep learning and moving forward.</p></header><div class="research-layout">{% for domain in site.data.research.domains %}{% unless domain.draft %}
<section class="domain" id="{{ domain.id }}"><h2>{{ domain.title }}{% assign mark_path = 'research-marks/' | append: domain.mark | append: '.svg' %}{% include {{ mark_path }} %}</h2>
{% for track in domain.tracks %}{% for project in track.projects %}{% unless project.draft %}
<article class="project"><p class="kicker">{{ track.label }}</p><h3>{{ project.title }}</h3>
<div class="project-people">{% if project.authors %}{% for author in project.authors %}{% if author.self %}<strong>{{ author.name }}</strong>{% elsif author.url %}<a href="{{ author.url }}">{{ author.name }}</a>{% else %}{{ author.name }}{% endif %}{% unless forloop.last %}, {% endunless %}{% endfor %}{% elsif project.advisor.name %}Advisor: {% if project.advisor.url %}<a href="{{ project.advisor.url }}">{{ project.advisor.name }}</a>{% else %}{{ project.advisor.name }}{% endif %}{% endif %}</div>
<p>{{ project.description }}</p>{% if project.resources.size > 0 %}<div class="project-links">{% for resource in project.resources %}<a href="{{ resource.url | relative_url }}">{{ resource.label }}</a>{% endfor %}</div>{% endif %}</article>
{% endunless %}{% endfor %}{% endfor %}</section>{% endunless %}{% endfor %}</div></section>
