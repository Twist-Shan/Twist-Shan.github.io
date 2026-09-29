---
layout: studio
title: Blog
permalink: /blog/
slug: blog
---

<header class="page-hero shell reveal">
  <p class="eyebrow">02 — Blog</p>
  <h1 class="motion-title">Notes from the <em>learning process.</em></h1>
  <p>Writings about research, people, places, and things I want to remember.</p>
</header>

<section class="post-list shell reveal">
  <div class="blog-filters" role="group" aria-label="Filter posts" hidden>
    <button type="button" data-blog-filter="all" aria-pressed="true">All</button>
    <span aria-hidden="true">/</span>
    <button type="button" data-blog-filter="research" aria-pressed="false">Research</button>
    <span aria-hidden="true">/</span>
    <button type="button" data-blog-filter="notes" aria-pressed="false">Notes</button>
    <span aria-hidden="true">/</span>
    <button type="button" data-blog-filter="others" aria-pressed="false">Others</button>
  </div>
  <p class="blog-filter-empty empty-note" role="status" hidden>No posts in this category yet.</p>
  {% if site.posts.size > 0 %}
    {% for post in site.posts %}
    {% assign blog_category = post.blog_category | default: 'others' | downcase %}
    <a data-blog-category="{{ blog_category | escape }}" class="post-row" href="{{ post.url | relative_url }}">
      <time>{{ post.date | date: '%Y.%m.%d' }}</time>
      <h2>{{ post.title }}</h2>
      <span>{{ post.tags | first | default: 'Note' }} ↗</span>
    </a>
    {% endfor %}
  {% else %}
    <div class="empty-note"><p>The notebook is open. The first entry is on its way.</p></div>
  {% endif %}
</section>
