---
layout: studio
title: Research
permalink: /research/
slug: research

# ============================================================
# Research Resources
#
# Every resource is optional.
# Empty values stay hidden.
#
# Resource order:
# synthetic repo -> realistic repo -> arXiv -> blog -> venue
#
# Advisor is also optional.
# If advisor.name is empty, the advisor link stays hidden.
# ============================================================


# ============================================================
# DL — Loop & Test-Time Training
# ============================================================

loop_ttt_links:
  synthetic_repo:
  realistic_repo:
  arxiv:
  blog:
  venue_label:
  venue_url:

loop_ttt_advisor:
  name:
  url:


# ============================================================
# RL — Pareto AI Identification
# ============================================================

pareto_links:
  synthetic_repo: https://github.com/Twist-Shan/Binary_Pairwise_Pareto_Syn
  realistic_repo: https://github.com/Twist-Shan/Binary_Pairwise_Pareto_Rea_Arena
  arxiv:
  blog:
  venue_label:
  venue_url:

pareto_advisor:
  name: Prof. Zhimei Ren
  url: https://zhimeir.github.io/


# ============================================================
# LLM — CoT Mechanism for Counting
# ============================================================

cot_links:
  synthetic_repo: https://github.com/Twist-Shan/Synthetic_CoT_NiaH_Count
  realistic_repo: https://github.com/Twist-Shan/Realistic_CoT_NiaH_Count
  arxiv:
  blog:
  venue_label:
  venue_url:

cot_advisor:
  name: Prof. Yiqiao Zhong
  url: https://pages.stat.wisc.edu/~zhong35/


# ============================================================
# DLM — Diffusion Language Models for Sudoku
# ============================================================

dlm_links:
  synthetic_repo:
  realistic_repo:
  arxiv:
  blog:
  venue_label:
  venue_url:

dlm_advisor:
  name:
  url:


# ============================================================
# HOW TO ADD A NEW PROJECT
#
# Step 1:
# Add two blocks like these:
#
# new_project_links:
#   synthetic_repo:
#   realistic_repo:
#   arxiv:
#   blog:
#   venue_label:
#   venue_url:
#
# new_project_advisor:
#   name:
#   url:
#
# Step 2:
# Copy one <article class="research-entry"> below into the
# desired research track.
#
# Step 3:
# Change:
#   - article id
#   - project title
#   - description
#   - page.xxx_links
#   - page.xxx_advisor
#
# You do NOT need to create another research-track if the new
# project belongs to an existing research direction.
# ============================================================
---


<!-- ========================================================
     DL / Architecture
     ======================================================== -->

<div class="research-track">
  <header class="research-track-header research-track-header--dl">
    <div class="research-track-title">
      <p>DL / Architecture</p>
    </div>
  </header>

  <article class="research-entry" id="loop-test-time-training">
    <h4>Loop &amp; Test-Time Training</h4>
    <p class="research-description">We want to study how lightweight test-time parameter updates interact with recurrent-depth computation in looped Transformers, aiming to jointly reduce operator mismatch and finite-iteration error.</p>

    <div class="research-links">

      {% if page.loop_ttt_links.synthetic_repo or page.loop_ttt_links.realistic_repo or page.loop_ttt_links.arxiv or page.loop_ttt_links.blog or page.loop_ttt_links.venue_label or page.loop_ttt_links.venue_url %}
      <div class="research-resources">

        {% if page.loop_ttt_links.synthetic_repo %}
        <a href="{{ page.loop_ttt_links.synthetic_repo }}">
          Synthetic repo <span>↗</span>
        </a>
        {% endif %}

        {% if page.loop_ttt_links.realistic_repo %}
        <a href="{{ page.loop_ttt_links.realistic_repo }}">
          Realistic repo <span>↗</span>
        </a>
        {% endif %}

        {% if page.loop_ttt_links.arxiv %}
        <a class="research-arxiv" href="{{ page.loop_ttt_links.arxiv }}">
          arXiv <span>↗</span>
        </a>
        {% endif %}

        {% if page.loop_ttt_links.blog %}
        <a class="research-blog" href="{{ page.loop_ttt_links.blog }}">
          Blog <span>↗</span>
        </a>
        {% endif %}

        {% if page.loop_ttt_links.venue_url %}
        <a class="research-venue" href="{{ page.loop_ttt_links.venue_url }}">
          {% if page.loop_ttt_links.venue_label %}
          {{ page.loop_ttt_links.venue_label }}
          {% else %}
          Venue
          {% endif %}
          <span>↗</span>
        </a>
        {% elsif page.loop_ttt_links.venue_label %}
        <span class="research-venue">
          {{ page.loop_ttt_links.venue_label }}
        </span>
        {% endif %}

      </div>
      {% endif %}


      {% if page.loop_ttt_advisor.name %}
        {% if page.loop_ttt_advisor.url %}
        <a class="research-advisor" href="{{ page.loop_ttt_advisor.url }}">
          Advisor · {{ page.loop_ttt_advisor.name }} <span>↗</span>
        </a>
        {% else %}
        <span class="research-advisor">
          Advisor · {{ page.loop_ttt_advisor.name }}
        </span>
        {% endif %}
      {% endif %}

    </div>
  </article>
</div>


<!-- ========================================================
     RL / Theory / Bandits
     ======================================================== -->

<div class="research-track">
  <header class="research-track-header research-track-header--rl">
    <div class="research-track-title">
      <p>RL / Theory / Bandits</p>
    </div>
  </header>

  <article class="research-entry" id="chatbot-arena-ranking">
    <h4>Pareto AI Identification</h4>
    <p class="research-description">We study Pareto-optimal set identification algorithms for evaluating models from human preferences, especially in AI Arena, through binary pairwise-feedback bandits with the Bradley-Terry model and Borda-score successive elimination.</p>

    <div class="research-links">

      {% if page.pareto_links.synthetic_repo or page.pareto_links.realistic_repo or page.pareto_links.arxiv or page.pareto_links.blog or page.pareto_links.venue_label or page.pareto_links.venue_url %}
      <div class="research-resources">

        {% if page.pareto_links.synthetic_repo %}
        <a href="{{ page.pareto_links.synthetic_repo }}">
          Synthetic repo <span>↗</span>
        </a>
        {% endif %}

        {% if page.pareto_links.realistic_repo %}
        <a href="{{ page.pareto_links.realistic_repo }}">
          Realistic repo <span>↗</span>
        </a>
        {% endif %}

        {% if page.pareto_links.arxiv %}
        <a class="research-arxiv" href="{{ page.pareto_links.arxiv }}">
          arXiv <span>↗</span>
        </a>
        {% endif %}

        {% if page.pareto_links.blog %}
        <a class="research-blog" href="{{ page.pareto_links.blog }}">
          Blog <span>↗</span>
        </a>
        {% endif %}

        {% if page.pareto_links.venue_url %}
        <a class="research-venue" href="{{ page.pareto_links.venue_url }}">
          {% if page.pareto_links.venue_label %}
          {{ page.pareto_links.venue_label }}
          {% else %}
          Venue
          {% endif %}
          <span>↗</span>
        </a>
        {% elsif page.pareto_links.venue_label %}
        <span class="research-venue">
          {{ page.pareto_links.venue_label }}
        </span>
        {% endif %}

      </div>
      {% endif %}


      {% if page.pareto_advisor.name %}
        {% if page.pareto_advisor.url %}
        <a class="research-advisor" href="{{ page.pareto_advisor.url }}">
          Advisor · {{ page.pareto_advisor.name }} <span>↗</span>
        </a>
        {% else %}
        <span class="research-advisor">
          Advisor · {{ page.pareto_advisor.name }}
        </span>
        {% endif %}
      {% endif %}

    </div>
  </article>
</div>


<!-- ========================================================
     LLM / Interpretability / Reasoning
     ======================================================== -->

<div class="research-track">
  <header class="research-track-header research-track-header--llm">
    <div class="research-track-title">
      <p>LLM / Interpretability / Reasoning</p>
    </div>
  </header>

  <article class="research-entry" id="cot-counting-mechanism">
    <h4>CoT Mechanism for Counting</h4>
    <p class="research-description">We investigate how Chain-of-Thought improves LLMs' counting ability by tracing the mechanism from controlled synthetic tasks on GPT-2-like Transformers to realistic needle-in-a-haystack settings in open-weight large models.</p>

    <div class="research-links">

      {% if page.cot_links.synthetic_repo or page.cot_links.realistic_repo or page.cot_links.arxiv or page.cot_links.blog or page.cot_links.venue_label or page.cot_links.venue_url %}
      <div class="research-resources">

        {% if page.cot_links.synthetic_repo %}
        <a href="{{ page.cot_links.synthetic_repo }}">
          Synthetic repo <span>↗</span>
        </a>
        {% endif %}

        {% if page.cot_links.realistic_repo %}
        <a href="{{ page.cot_links.realistic_repo }}">
          Realistic repo <span>↗</span>
        </a>
        {% endif %}

        {% if page.cot_links.arxiv %}
        <a class="research-arxiv" href="{{ page.cot_links.arxiv }}">
          arXiv <span>↗</span>
        </a>
        {% endif %}

        {% if page.cot_links.blog %}
        <a class="research-blog" href="{{ page.cot_links.blog }}">
          Blog <span>↗</span>
        </a>
        {% endif %}

        {% if page.cot_links.venue_url %}
        <a class="research-venue" href="{{ page.cot_links.venue_url }}">
          {% if page.cot_links.venue_label %}
          {{ page.cot_links.venue_label }}
          {% else %}
          Venue
          {% endif %}
          <span>↗</span>
        </a>
        {% elsif page.cot_links.venue_label %}
        <span class="research-venue">
          {{ page.cot_links.venue_label }}
        </span>
        {% endif %}

      </div>
      {% endif %}


      {% if page.cot_advisor.name %}
        {% if page.cot_advisor.url %}
        <a class="research-advisor" href="{{ page.cot_advisor.url }}">
          Advisor · {{ page.cot_advisor.name }} <span>↗</span>
        </a>
        {% else %}
        <span class="research-advisor">
          Advisor · {{ page.cot_advisor.name }}
        </span>
        {% endif %}
      {% endif %}

    </div>
  </article>


  <aside class="research-aside">
    <p>
      We are also interested in the geometry and compression of hidden-state representations; some toy experiments are available in
      <a href="https://github.com/Twist-Shan/Hidden_State_Evaluation">
        Hidden State Evaluation <span>↗</span>
      </a>.
    </p>
  </aside>
</div>


<!-- ========================================================
     DLM / Interpretability
     ======================================================== -->

<div class="research-track">
  <header class="research-track-header research-track-header--dlm">
    <div class="research-track-title">
      <p>DLM / Interpretability</p>
    </div>
  </header>

  <article class="research-entry" id="diffusion-language-model-sudoku">
    <h4>Diffusion Language Models for Sudoku</h4>
    <p class="research-description">We want to study how diffusion language models enable efficient planning and reasoning on tasks such as Sudoku, and how different adaptive decoding orders affect their reasoning behavior.</p>

    <div class="research-links">

      {% if page.dlm_links.synthetic_repo or page.dlm_links.realistic_repo or page.dlm_links.arxiv or page.dlm_links.blog or page.dlm_links.venue_label or page.dlm_links.venue_url %}
      <div class="research-resources">

        {% if page.dlm_links.synthetic_repo %}
        <a href="{{ page.dlm_links.synthetic_repo }}">
          Synthetic repo <span>↗</span>
        </a>
        {% endif %}

        {% if page.dlm_links.realistic_repo %}
        <a href="{{ page.dlm_links.realistic_repo }}">
          Realistic repo <span>↗</span>
        </a>
        {% endif %}

        {% if page.dlm_links.arxiv %}
        <a class="research-arxiv" href="{{ page.dlm_links.arxiv }}">
          arXiv <span>↗</span>
        </a>
        {% endif %}

        {% if page.dlm_links.blog %}
        <a class="research-blog" href="{{ page.dlm_links.blog }}">
          Blog <span>↗</span>
        </a>
        {% endif %}

        {% if page.dlm_links.venue_url %}
        <a class="research-venue" href="{{ page.dlm_links.venue_url }}">
          {% if page.dlm_links.venue_label %}
          {{ page.dlm_links.venue_label }}
          {% else %}
          Venue
          {% endif %}
          <span>↗</span>
        </a>
        {% elsif page.dlm_links.venue_label %}
        <span class="research-venue">
          {{ page.dlm_links.venue_label }}
        </span>
        {% endif %}

      </div>
      {% endif %}


      {% if page.dlm_advisor.name %}
        {% if page.dlm_advisor.url %}
        <a class="research-advisor" href="{{ page.dlm_advisor.url }}">
          Advisor · {{ page.dlm_advisor.name }} <span>↗</span>
        </a>
        {% else %}
        <span class="research-advisor">
          Advisor · {{ page.dlm_advisor.name }}
        </span>
        {% endif %}
      {% endif %}

    </div>
  </article>
</div>


<!-- ========================================================
     ADDING ANOTHER PROJECT LATER

     1. Add xxx_links and xxx_advisor to the front matter.
     2. Copy an existing <article class="research-entry">.
     3. Paste it inside the desired research-track.
     4. Change:
          - id
          - h4 title
          - description
          - page.xxx_links
          - page.xxx_advisor

     Keep the same <div class="research-track"> when multiple
     projects belong to the same research direction.
     ======================================================== -->