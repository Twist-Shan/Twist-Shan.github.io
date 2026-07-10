---
layout: studio
permalink: /
slug: home
redirect_from:
  - /about/
  - /about.html
---

<section class="hero shell">
  <div class="hero-index" aria-hidden="true">01 — ABOUT</div>
  <div class="hero-copy reveal">
    <p class="eyebrow"><span class="status-dot"></span> Undergraduate student · Peking University</p>
    <h1>Liang <em>(Twist)</em> Shan</h1>
    <div class="about-copy">
      <h2>About</h2>
      <p class="hero-intro">I’m an undergraduate at Peking University pursuing a double major in Statistics in the School of Mathematical Sciences and Economics in the National School of Development.</p>
      <p>My research interests focus on the applications of statistics and optimization in modern machine learning, especially in Deep Learning (DL), Reinforcement Learning (RL), and Large Language Models (LLMs). I am seeking PhD opportunities beginning in Fall 2028.</p>
    </div>
    <div class="hero-actions">
      <a class="text-link" href="{{ '/research/' | relative_url }}">Explore my research <span>↗</span></a>
      <a class="text-link quiet" href="{{ '/files/cv_Liang_Shan.pdf' | relative_url }}">Read my CV <span>↓</span></a>
    </div>
    <nav class="hero-socials" aria-label="Social profiles">
      <a href="https://github.com/Twist-Shan">GitHub <span>↗</span></a>
      <a href="https://www.linkedin.com/in/liang-twist-shan">LinkedIn <span>↗</span></a>
      <a href="https://instagram.com/twist_shan">Instagram <span>↗</span></a>
      <a href="https://x.com/LiangTwistShan">X <span>↗</span></a>
    </nav>
  </div>
  <figure class="portrait-wrap reveal delay-1">
    <div class="portrait-frame">
      <img src="{{ '/images/profile.jpg' | relative_url }}" alt="Portrait of Liang Shan" width="720" height="900">
    </div>
    <figcaption><span>Liang Shan</span><span>Madison</span></figcaption>
  </figure>
</section>

<section class="education shell ruled-section reveal">
  <header class="section-label">
    <span>02</span><h2>Education</h2>
  </header>
  <div class="timeline">
    <article>
      <time>2023 — 2028</time>
      <div><h3>Peking University</h3><p>B.S. in Mathematics (Statistics) · School of Mathematical Sciences<br>B.A. in Economics · National School of Development</p></div>
      <span class="place">Beijing</span>
    </article>
    <article>
      <time>2025 — 2026</time>
      <div><h3>University of Copenhagen</h3><p>Exchange student · Department of SCIENCE</p></div>
      <span class="place">Copenhagen</span>
    </article>
  </div>
</section>

<section class="news shell ruled-section reveal">
  <header class="section-label">
    <span>03</span><h2>Short notes</h2><p>Small updates from my desk.</p>
  </header>
  <div class="news-list">
    {% for item in site.data.news %}
      {% if item.link != '' %}<a class="news-item" href="{{ item.link }}">{% else %}<div class="news-item">{% endif %}
        <time>{{ item.date }}</time><p>{{ item.text }}</p><span aria-hidden="true">{% if item.link != '' %}↗{% endif %}</span>
      {% if item.link != '' %}</a>{% else %}</div>{% endif %}
    {% endfor %}
  </div>
</section>

<aside class="contact-band">
  <div class="shell reveal">
    <div class="contact-heading">
      <p>Questions, ideas, or a good paper?</p>
      <h2>Let’s keep in touch.</h2>
    </div>
    <div class="contact-details">
      <a href="mailto:twistshan1218@gmail.com"><span class="email-text">twistshan1218<wbr>@gmail.com</span> <span aria-hidden="true">↗</span></a>
      <p><span>WeChat</span> Twist_SsLl</p>
    </div>
  </div>
</aside>
