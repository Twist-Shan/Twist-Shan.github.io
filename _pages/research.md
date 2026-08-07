---
layout: studio
title: Research
permalink: /research/
slug: research

# ============================================================
# Research Page
#
# All research content is managed below.
# The Liquid/HTML template at the bottom should normally
# NOT need to be modified when adding new projects.
#
# Resource order:
# synthetic repo -> realistic repo -> arXiv -> blog -> venue
#
# Every resource is optional. Empty values stay hidden.
# Advisor is also optional.
# ============================================================


# ============================================================
# HOW TO ADD A NEW PROJECT
#
# Copy the block below into "projects:" under any research track.
#
#      - id: project-id
#        draft: false
#        title: Project Title
#        description: >-
#          One-sentence project description.
#
#        links:
#          synthetic_repo:
#          realistic_repo:
#          arxiv:
#          blog:
#          venue_label:
#          venue_url:
#
#        advisor:
#          name:
#          url:
#
# Notes:
# - "id" must be unique across the page.
# - Use lowercase kebab-case for id, e.g. loop-test-time-training.
# - Set draft: true if you want to keep the project hidden.
# - Empty links/advisor fields will not be displayed.
# ============================================================


research_tracks:

  # ==========================================================
  # Deep Learning
  # ==========================================================
  - key: dl
    title: DL / Architecture

    projects:

      - id: loop-test-time-training
        draft: false
        title: Loop & Test-Time Training
        description: >-
          We want to study how lightweight test-time parameter updates interact with recurrent-depth computation in looped Transformers, aiming to jointly reduce operator mismatch and finite-iteration error.

        links:
          code_repo:
          arxiv:
          blog:
          venue_label:
          venue_url:

        advisor:
          name:
          url:

  # ==========================================================
  # RL / Theory / Bandits
  # ==========================================================
  - key: rl
    title: RL / Theory / Bandits

    projects:

      - id: chatbot-arena-ranking
        draft: false
        title: Pareto AI Identification
        description: >-
          We study Pareto-optimal set identification algorithms for evaluating models from human preferences, especially in AI Arena, through binary pairwise-feedback bandits with the Bradley-Terry model and Borda-score successive elimination.

        links:
          synthetic_repo: https://github.com/Twist-Shan/Binary_Pairwise_Pareto_Syn
          realistic_repo: https://github.com/Twist-Shan/Binary_Pairwise_Pareto_Rea_Arena
          arxiv: 
          blog: 
          venue_label: 
          venue_url: 

        advisor:
          name: Prof. Zhimei Ren
          url: https://zhimeir.github.io/


  # ==========================================================
  # LLM / Interpretability / Reasoning
  # ==========================================================
  - key: llm
    title: LLM / Interpretability / Reasoning

    projects:

      - id: cot-counting-mechanism
        draft: false
        title: CoT Mechanism for Counting
        description: >-
          We investigate how Chain-of-Thought improves LLMs' counting ability by tracing the mechanism from controlled synthetic tasks on GPT-2-like Transformers to realistic needle-in-a-haystack settings in open-weight large models.

        links:
          synthetic_repo: https://github.com/Twist-Shan/Synthetic_CoT_NiaH_Count
          realistic_repo: https://github.com/Twist-Shan/Realistic_CoT_NiaH_Count
          arxiv:
          blog:
          venue_label:
          venue_url:

        advisor:
          name: Prof. Yiqiao Zhong
          url: https://pages.stat.wisc.edu/~zhong35/

    aside:
      prefix: >-
        We are also interested in the geometry and compression of hidden-state representations; some toy experiments are available in
      link_label: Hidden State Evaluation
      link_url: https://github.com/Twist-Shan/Hidden_State_Evaluation
      suffix: "."

  # ==========================================================
  # Diffusion Language Model
  # ==========================================================
  - key: dlm
    title: DLM / Interpretability

    projects:

      - id: diffusion-language-model-sudoku
        draft: false
        title: Diffusion Language Models for Sudoku
        description: >-
          We want to study how diffusion language models enable efficient planning and reasoning on specific tasks like Sudoku, and how different adaptive decoding order affects them.

        links:
          code_repo:
          arxiv:
          blog:
          venue_label:
          venue_url:

        advisor:
          name:
          url:

---


{% for track in page.research_tracks %}
<div class="research-track">

  <header class="research-track-header research-track-header--{{ track.key }}">
    <div class="research-track-title">
      <p>{{ track.title }}</p>
    </div>
  </header>


  {% for project in track.projects %}
  {% unless project.draft %}

  <article class="research-entry" id="{{ project.id }}">
    <h4>{{ project.title }}</h4>

    {% if project.description %}
    <p class="research-description">{{ project.description }}</p>
    {% endif %}

    <div class="research-links">

      {% assign links = project.links %}

      {% if links.synthetic_repo or links.realistic_repo or links.arxiv or links.blog or links.venue_label or links.venue_url %}
      <div class="research-resources">

        {% if links.synthetic_repo %}
        <a href="{{ links.synthetic_repo }}">
          Synthetic repo <span>↗</span>
        </a>
        {% endif %}

        {% if links.realistic_repo %}
        <a href="{{ links.realistic_repo }}">
          Realistic repo <span>↗</span>
        </a>
        {% endif %}

        {% if links.arxiv %}
        <a class="research-arxiv" href="{{ links.arxiv }}">
          arXiv <span>↗</span>
        </a>
        {% endif %}

        {% if links.blog %}
        <a class="research-blog" href="{{ links.blog }}">
          Blog <span>↗</span>
        </a>
        {% endif %}

        {% if links.venue_url %}
        <a class="research-venue" href="{{ links.venue_url }}">
          {% if links.venue_label %}
          {{ links.venue_label }}
          {% else %}
          Venue
          {% endif %}
          <span>↗</span>
        </a>

        {% elsif links.venue_label %}
        <span class="research-venue">
          {{ links.venue_label }}
        </span>
        {% endif %}

      </div>
      {% endif %}


      {% if project.advisor.name %}

        {% if project.advisor.url %}
        <a class="research-advisor" href="{{ project.advisor.url }}">
          Advisor · {{ project.advisor.name }} <span>↗</span>
        </a>

        {% else %}
        <span class="research-advisor">
          Advisor · {{ project.advisor.name }}
        </span>
        {% endif %}

      {% endif %}

    </div>
  </article>

  {% endunless %}
  {% endfor %}


  {% if track.aside %}
  <aside class="research-aside">
    <p>
      {{ track.aside.prefix }}
      {% if track.aside.link_url and track.aside.link_label %}
      <a href="{{ track.aside.link_url }}">
        {{ track.aside.link_label }} <span>↗</span>
      </a>
      {% endif %}{{ track.aside.suffix }}
    </p>
  </aside>
  {% endif %}

</div>
{% endfor %}