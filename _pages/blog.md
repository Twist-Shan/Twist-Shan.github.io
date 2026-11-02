---
layout: studio
title: Blog
permalink: /blog/
slug: blog
---
<section class="page" id="blog"><header class="page-title"><p class="kicker">02 / Blog</p><h1 class="motion-title">Notes from the <em>learning process.</em></h1><p>Writings about research, people, places, and things I want to remember.</p></header><nav aria-label="Filter posts" class="filters"><button aria-pressed="true" data-filter="all">All</button><button aria-pressed="false" data-filter="research">Research</button><button aria-pressed="false" data-filter="notes">Notes</button><button aria-pressed="false" data-filter="others">Others</button></nav><div>{% for post in site.posts %}{% assign category = post.blog_category | default: 'others' | downcase %}{% assign minutes = post.reading_minutes %}{% unless minutes %}{% assign minutes = post.content | strip_html | number_of_words | divided_by: 220 | plus: 1 %}{% endunless %}
<a class="post-row" data-category="{{ category }}" href="{{ post.url | relative_url }}"><h3>{{ post.title }}</h3><p class="post-excerpt">{{ post.excerpt | strip_html | truncate: 260 }}</p><div class="post-meta"><time>{{ post.date | date: '%Y.%m.%d' }}</time><span> · {{ category | capitalize }} · {{ minutes }} min read</span></div></a>{% endfor %}</div></section>
