---
layout: studio
title: Blog
permalink: /blog/
slug: blog
---

<header class="page-hero shell reveal">
  <p class="eyebrow">02 — Blog</p>
  <h1>Notes from the <em>learning process.</em></h1>
  <p>Writings about research, people, places, and things I want to remember.</p>
</header>

<section class="post-list shell reveal">
  {% if site.posts.size > 0 %}
    {% for post in site.posts %}
    <a class="post-row" href="{{ post.url | relative_url }}">
      <time>{{ post.date | date: '%Y.%m.%d' }}</time>
      <h2>{{ post.title }}</h2>
      <span>{{ post.tags | first | default: 'Note' }} ↗</span>
    </a>
    {% endfor %}
  {% else %}
    <div class="empty-note"><p>The notebook is open. The first entry is on its way.</p></div>
  {% endif %}
</section>
