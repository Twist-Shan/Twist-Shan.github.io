(() => {
  "use strict";

  const root = document.documentElement;
  let syncGalleryTheme = () => {};
  const article = document.querySelector(".article-prose");

  if (article && typeof window.renderMathInElement === "function") {
    window.renderMathInElement(article, {
      delimiters: [
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false }
      ],
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
      throwOnError: false,
      strict: "error",
      trust: false,
      output: "htmlAndMathml",
      errorColor: "#9e4246"
    });
    root.classList.add("latex-ready");
  }

  const announcer = document.querySelector("[data-announcer]");
  const announce = (message) => {
    if (!announcer) return;
    announcer.textContent = "";
    window.setTimeout(() => { announcer.textContent = message; }, 20);
  };

  // Native dialog keeps keyboard focus inside the enlarged figure and supports
  // Escape. Without JavaScript, each figure remains an ordinary image link.
  const figureDialog = document.getElementById("figure-dialog");
  if (figureDialog && typeof figureDialog.showModal === "function") {
    const dialogImage = document.getElementById("figure-dialog-image");
    const dialogTitle = document.getElementById("figure-dialog-title");
    const dialogCaption = document.getElementById("figure-dialog-caption");
    const zoomButton = document.getElementById("figure-fit");
    const closeButton = document.getElementById("figure-close");
    const imageWrap = figureDialog.querySelector(".dialog-image-wrap");
    let figureTrigger = null;
    const alignDialogCaption = () => {
      if (!figureDialog.open || !dialogImage.naturalWidth) return;
      const bounds = dialogImage.getBoundingClientRect();
      const style = getComputedStyle(dialogImage);
      const width = bounds.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const height = bounds.height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      const paintedWidth = Math.min(width, height * dialogImage.naturalWidth / dialogImage.naturalHeight);
      dialogCaption.style.width = `${Math.min(paintedWidth, imageWrap.clientWidth)}px`;
    };
    dialogImage.addEventListener("load", alignDialogCaption);
    new ResizeObserver(alignDialogCaption).observe(imageWrap);
    const setZoom = (zoomed) => {
      figureDialog.classList.toggle("is-zoomed", zoomed);
      zoomButton.setAttribute("aria-pressed", String(zoomed));
      zoomButton.textContent = zoomed ? "Fit to view −" : "Zoom in +";
      imageWrap.scrollTo(0, 0);
      requestAnimationFrame(alignDialogCaption);
    };
    document.querySelectorAll("[data-zoom]").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const sourceImage = link.querySelector("img");
        if (!sourceImage) return;
        event.preventDefault();
        figureTrigger = link;
        figureDialog.classList.toggle("is-cover", root.dataset.theme === "dark");
        setZoom(false);
        dialogImage.src = sourceImage.currentSrc || sourceImage.src;
        dialogImage.alt = sourceImage.alt;
        dialogTitle.textContent = link.getAttribute("aria-label").replace(/^Enlarge:\s*/i, "");
        dialogCaption.textContent = link.closest("figure").querySelector("figcaption")?.textContent || "";
        figureDialog.showModal();
        requestAnimationFrame(alignDialogCaption);
        document.body.classList.add("dialog-open");
        closeButton.focus();
      });
    });
    zoomButton.addEventListener("click", () => setZoom(!figureDialog.classList.contains("is-zoomed")));
    closeButton.addEventListener("click", () => figureDialog.close());
    figureDialog.addEventListener("click", (event) => {
      if (event.target !== figureDialog) return;
      const bounds = figureDialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) figureDialog.close();
    });
    figureDialog.addEventListener("close", () => {
      document.body.classList.remove("dialog-open");
      figureTrigger?.focus({ preventScroll: true });
    });
  }

  const themeToggle = document.querySelector(".theme-toggle");
  const syncThemeButton = () => {
    const dark = root.dataset.theme === "dark";
    const allocation = document.querySelector("[data-allocation-image]");
    if (allocation) {
      const source = dark ? "assets/figures/allocation-vs-gap-dark.svg" : "assets/figures/allocation-vs-gap.svg";
      allocation.src = source;
      allocation.closest("a").href = source;
    }
    syncGalleryTheme();
    const cover = document.querySelector(".hero-figure .figure-zoom img");
    if (cover) {
      const source = dark ? "assets/figures/arena-35-pareto-3d-dark.svg" : "assets/figures/arena-35-pareto-3d.svg";
      cover.src = source;
      cover.closest("a").href = source;
    }
    if (!themeToggle) return;
    themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.setAttribute("aria-pressed", String(dark));
  };

  syncThemeButton();

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-navigation");
  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const nextOpen = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(nextOpen));
      navigation.classList.toggle("is-open", nextOpen);
    });
    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        navigation.classList.remove("is-open");
      });
    });
  }

  const progressBar = document.querySelector(".reading-progress span");
  if (progressBar) {
    let progressFrame = 0;
    const updateProgress = () => {
      progressFrame = 0;
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
      progressBar.style.transform = `scaleX(${progress})`;
    };
    document.addEventListener("scroll", () => {
      if (!progressFrame) progressFrame = window.requestAnimationFrame(updateProgress);
    }, { passive: true });
    updateProgress();
  }

  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -7%" });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const sections = Array.from(document.querySelectorAll(".article-section[id]"));
  const tocItems = Array.from(document.querySelectorAll("[data-toc-section]"));
  const setActiveSection = (id) => {
    tocItems.forEach((item) => {
      const active = item.dataset.tocSection === id;
      item.classList.toggle("is-active", active);
      const link = item.querySelector("a");
      if (link) {
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const visibleSections = new Map();
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleSections.set(entry.target.id, entry.boundingClientRect.top);
        else visibleSections.delete(entry.target.id);
      });
      if (!visibleSections.size) return;
      const nearest = Array.from(visibleSections.entries()).sort((a, b) => Math.abs(a[1]) - Math.abs(b[1]))[0];
      setActiveSection(nearest[0]);
    }, { rootMargin: "-12% 0px -70% 0px", threshold: [0, 1] });
    sections.forEach((section) => sectionObserver.observe(section));
    setActiveSection(sections[0].id);
  }

  document.querySelectorAll(".mobile-toc a").forEach((link) => {
    link.addEventListener("click", () => {
      const details = link.closest("details");
      if (details) details.open = false;
    });
  });

  const algorithmContent = {
    sample: {
      kicker: "Sampling phase / collect evidence",
      title: "Collect more comparisons.",
      copy: "Bring every active model–objective pair to the same sample count for this phase. Opponents are drawn from the full original roster, including models already classified."
    },
    estimate: {
      kicker: "Vector-Borda / one mean per coordinate",
      title: "Turn binary wins into an empirical score vector.",
      copy: "Average the binary outcomes for each active coordinate. Simultaneous confidence intervals cover the Borda means across coordinates and phases; increasing the phase sample count reduces their common radius."
    },
    certify: {
      kicker: "Empirical gap / compare with uncertainty",
      title: "Check whether there is enough evidence to classify a model.",
      copy: "A dominated model needs a clear domination certificate. A frontier model must also remain available while it is needed as a witness for other classifications. The empirical gap combines these requirements and is compared with four times the confidence radius."
    },
    eliminate: {
      kicker: "Accept or reject / then reuse the estimates",
      title: "Remove one certified model and recompute.",
      copy: "Select the largest qualifying empirical gap. Accept an empirically non-dominated model or reject a dominated one, then recompute gaps without new observations. If one active model remains, accept it and stop; otherwise begin another phase when needed."
    }
  };

  const algorithm = document.querySelector("[data-algorithm]");
  if (algorithm) {
    const tabs = Array.from(algorithm.querySelectorAll("[data-algorithm-step]"));
    const kicker = algorithm.querySelector("[data-algorithm-kicker]");
    const title = algorithm.querySelector("[data-algorithm-title]");
    const copy = algorithm.querySelector("[data-algorithm-copy]");
    const selectStep = (tab) => {
      const content = algorithmContent[tab.dataset.algorithmStep];
      tabs.forEach((candidate) => {
        const active = candidate === tab;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-selected", String(active));
        candidate.setAttribute("tabindex", active ? "0" : "-1");
      });
      kicker.textContent = content.kicker;
      title.textContent = content.title;
      copy.textContent = content.copy;
      announce(`${content.title} ${content.copy}`);
    };
    tabs.forEach((tab, index) => {
      tab.setAttribute("tabindex", index === 0 ? "0" : "-1");
      tab.addEventListener("click", () => selectStep(tab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = tabs.indexOf(tab);
        if (event.key === "ArrowLeft") nextIndex = (nextIndex - 1 + tabs.length) % tabs.length;
        if (event.key === "ArrowRight") nextIndex = (nextIndex + 1) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        tabs[nextIndex].focus();
        selectStep(tabs[nextIndex]);
      });
    });
  }

  const performanceViews = {
    realistic: {
      title: "Real-data replay cost",
      image: "assets/realistic-benchmarks.png?v=20261013",
      darkImage: "assets/figures/realistic-benchmarks-dark.svg",
      alt: "Grouped bar chart comparing mean coordinate-specific comparisons on three fixed Arena datasets; VB-EGE is lowest in each group.",
      caption: "Mean stopping time over 100 independent replays of each dataset. VB-EGE has the lowest mean stopping time on all three datasets. The vertical axis is logarithmic. Error bars show one standard error."
    },
    synthetic: {
      title: "Synthetic benchmark cost",
      image: "assets/synthetic-benchmarks.png?v=20261013",
      darkImage: "assets/figures/synthetic-benchmarks-dark.svg",
      alt: "Grouped logarithmic bar chart of eight synthetic benchmarks; VB-EGE has the smallest mean stopping time in every setting.",
      caption: "Mean stopping time on eight heterogeneous synthetic settings. Each setting has 500 trials; Convex-3D and Arena-10 use 50 latent instances with 10 outcome repetitions each. VB-EGE has the smallest mean cost in every setting. Error bars show one standard error."
    },
    scaling: {
      title: "Scaling in models, objectives, gap, and confidence",
      image: "assets/scaling-laws.png?v=20261013",
      darkImage: "assets/figures/scaling-laws-dark.svg",
      alt: "Four panels showing mean stopping time as the number of models, number of objectives, separation gap, and confidence level vary.",
      caption: "Mean stopping time on the symmetric hard family, with 500 trials per setting. Panels vary model count, objective count, latent separation, and error tolerance. All vertical axes are logarithmic. Error bars show one standard error. The observed scaling trends are consistent with our theoretical predictions."
    }
  };

  const gallery = document.querySelector("[data-performance-gallery]");
  if (gallery) {
    const tabs = Array.from(gallery.querySelectorAll("[data-performance-view]"));
    const title = gallery.querySelector("[data-performance-title]");
    const image = gallery.querySelector("[data-performance-image]");
    const caption = gallery.querySelector("[data-performance-caption]");
    const selectView = (tab) => {
      const view = performanceViews[tab.dataset.performanceView];
      tabs.forEach((candidate) => {
        const active = candidate === tab;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-selected", String(active));
        candidate.setAttribute("tabindex", active ? "0" : "-1");
      });
      title.textContent = view.title;
      const source = root.dataset.theme === "dark" ? view.darkImage : view.image;
      image.src = source;
      image.alt = view.alt;
      caption.textContent = view.caption;
      const figureLink = image.closest("[data-zoom]");
      figureLink.href = source;
      figureLink.setAttribute("aria-label", `Enlarge: ${view.title}`);
    };
    syncGalleryTheme = () => selectView(tabs.find((tab) => tab.classList.contains("is-active")) || tabs[0]);
    syncGalleryTheme();
    tabs.forEach((tab, index) => {
      tab.setAttribute("tabindex", index === 0 ? "0" : "-1");
      tab.addEventListener("click", () => selectView(tab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = tabs.indexOf(tab);
        if (event.key === "ArrowLeft") nextIndex = (nextIndex - 1 + tabs.length) % tabs.length;
        if (event.key === "ArrowRight") nextIndex = (nextIndex + 1) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        tabs[nextIndex].focus();
        selectView(tabs[nextIndex]);
      });
    });
  }

  const explorer = document.querySelector("[data-explorer]");
  const blogData = window.PARETO_BLOG_DATA;
  let redrawPlot = () => {};

  if (explorer && blogData) {
    const datasetSelect = explorer.querySelector("[data-dataset]");
    const dimensionButtons = Array.from(explorer.querySelectorAll("[data-dimension]"));
    const axisX = explorer.querySelector('[data-axis="x"]');
    const axisY = explorer.querySelector('[data-axis="y"]');
    const axisZ = explorer.querySelector('[data-axis="z"]');
    const zField = explorer.querySelector(".field--z");
    const projectionCount = explorer.querySelector("[data-projection-count]");
    const fullCount = explorer.querySelector("[data-full-count]");
    const roster = explorer.querySelector("[data-roster]");
    const routing = explorer.querySelector("[data-routing]");
    const projectionLabel = explorer.querySelector("[data-projection-label]");
    const frontierList = explorer.querySelector("[data-frontier-list]");
    const loading = explorer.querySelector("[data-plot-loading]");
    const plotElement = explorer.querySelector("#pareto-plot");
    const resetView = explorer.querySelector("[data-reset-view]");
    let dimension = 2;
    let plotReady = false;
    let viewRevision = 0;

    const getDataset = () => blogData.datasets[datasetSelect.value];
    const activeSelects = () => dimension === 3 ? [axisX, axisY, axisZ] : [axisX, axisY];
    const selectedAxes = () => activeSelects().map((select) => select.value);

    const populateAxes = () => {
      const dataset = getDataset();
      [axisX, axisY, axisZ].forEach((select, index) => {
        select.replaceChildren();
        dataset.dimensions.forEach((key) => {
          const option = document.createElement("option");
          option.value = key;
          option.textContent = dataset.labels[key];
          select.appendChild(option);
        });
        select.value = dataset.defaults[index] || dataset.dimensions[index] || dataset.dimensions[0];
      });
      updateDisabledAxes();
    };

    const ensureDistinctAxes = (changedSelect) => {
      const selects = activeSelects();
      const duplicated = selects.filter((select) => select.value === changedSelect.value);
      if (duplicated.length < 2) return;
      const target = duplicated.find((select) => select !== changedSelect);
      const used = new Set(selects.filter((select) => select !== target).map((select) => select.value));
      const replacement = getDataset().dimensions.find((key) => !used.has(key));
      if (replacement) target.value = replacement;
      announce("Axes must be distinct. The repeated axis was replaced automatically.");
    };

    function updateDisabledAxes() {
      const selects = activeSelects();
      selects.forEach((select) => {
        const otherValues = new Set(selects.filter((candidate) => candidate !== select).map((candidate) => candidate.value));
        Array.from(select.options).forEach((option) => {
          option.disabled = otherValues.has(option.value) && option.value !== select.value;
        });
      });
      if (dimension === 2) {
        Array.from(axisZ.options).forEach((option) => { option.disabled = false; });
      }
    }

    const isFrontier = (rows, axes) => rows.map((row, index) => {
      return !rows.some((challenger, challengerIndex) => {
        return index !== challengerIndex && axes.every((axis) => challenger.scores[axis] > row.scores[axis]);
      });
    });

    const cssColor = (name, fallback) => {
      const value = getComputedStyle(root).getPropertyValue(name).trim();
      return value || fallback;
    };

    const paddedRange = (values) => {
      const minimum = Math.min(...values);
      const maximum = Math.max(...values);
      const spread = Math.max(0.04, maximum - minimum);
      const pad = spread * 0.09;
      return [Math.max(0, minimum - pad), Math.min(1, maximum + pad)];
    };

    const hoverText = (row, dataset, axes, fullFrontier) => {
      const scores = axes.map((axis) => `${dataset.labels[axis]}: ${row.scores[axis].toFixed(3)}`).join("<br>");
      const status = fullFrontier.has(row.model) ? "Full-dimensional frontier: yes" : "Full-dimensional frontier: no";
      return `<b>${row.model}</b><br>${row.provider}<br><br>${scores}<br><br>${status}`;
    };

    const renderPlot = async () => {
      const dataset = getDataset();
      const axes = selectedAxes();
      const rows = dataset.rows;
      const frontierMask = isFrontier(rows, axes);
      const projectedRows = rows.filter((_, index) => frontierMask[index]);
      const fullFrontierSet = new Set(dataset.fullFrontier);
      const providers = Array.from(new Set(rows.map((row) => row.provider))).sort();
      const dark = root.dataset.theme === "dark";
      const ink = cssColor("--ink", dark ? "#f0efeb" : "#2d2d32");
      const muted = cssColor("--muted", dark ? "#aaa9af" : "#6d7069");
      const line = dark ? "rgba(240,239,235,0.14)" : "rgba(45,45,50,0.13)";
      const paper = cssColor("--paper", dark ? "#171a1e" : "#fafaf7");
      const coral = cssColor("--coral-ink", dark ? "#f0a0a3" : "#8e4149");
      const traces = [];

      providers.forEach((provider) => {
        const group = rows.filter((row, index) => row.provider === provider && !frontierMask[index]);
        if (!group.length) return;
        const trace = {
          type: dimension === 3 ? "scatter3d" : "scatter",
          mode: "markers",
          name: provider,
          legendgroup: provider,
          x: group.map((row) => row.scores[axes[0]]),
          y: group.map((row) => row.scores[axes[1]]),
          text: group.map((row) => hoverText(row, dataset, axes, fullFrontierSet)),
          hovertemplate: "%{text}<extra></extra>",
          marker: {
            size: dimension === 3 ? 5.5 : 9,
            color: blogData.palette[provider] || blogData.palette.Other,
            opacity: 0.55,
            line: { color: dark ? "#32363d" : "#ffffff", width: 0.8 }
          }
        };
        if (dimension === 3) trace.z = group.map((row) => row.scores[axes[2]]);
        traces.push(trace);
      });

      if (dimension === 2 && projectedRows.length > 1) {
        const ordered = projectedRows.slice().sort((left, right) => left.scores[axes[0]] - right.scores[axes[0]]);
        traces.push({
          type: "scatter",
          mode: "lines",
          name: "Frontier guide",
          showlegend: false,
          hoverinfo: "skip",
          x: ordered.map((row) => row.scores[axes[0]]),
          y: ordered.map((row) => row.scores[axes[1]]),
          line: { color: coral, width: 1.5, dash: "dot" }
        });
      }

      const frontierTrace = {
        type: dimension === 3 ? "scatter3d" : "scatter",
        mode: "markers",
        name: `${dimension}D strict frontier`,
        legendgroup: "frontier",
        x: projectedRows.map((row) => row.scores[axes[0]]),
        y: projectedRows.map((row) => row.scores[axes[1]]),
        text: projectedRows.map((row) => hoverText(row, dataset, axes, fullFrontierSet)),
        hovertemplate: "%{text}<extra></extra>",
        marker: {
          size: dimension === 3 ? 9 : 13,
          symbol: "diamond",
          color: projectedRows.map((row) => blogData.palette[row.provider] || blogData.palette.Other),
          opacity: 1,
          line: { color: coral, width: dimension === 3 ? 4 : 3 }
        }
      };
      if (dimension === 3) frontierTrace.z = projectedRows.map((row) => row.scores[axes[2]]);
      traces.push(frontierTrace);

      const layout = {
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        dragmode: dimension === 3 ? "orbit" : "pan",
        font: { family: 'Aptos, "Helvetica Neue", Helvetica, Arial, sans-serif', color: muted, size: 12 },
        margin: dimension === 3 ? { l: 10, r: 10, t: 24, b: 28 } : { l: 68, r: 28, t: 26, b: 66 },
        hoverlabel: { bgcolor: dark ? "#24282e" : "#fffef9", bordercolor: coral, font: { color: ink, size: 12 } },
        legend: {
          orientation: "h",
          x: 0,
          xanchor: "left",
          y: dimension === 3 ? -0.04 : -0.19,
          yanchor: "top",
          font: { color: muted, size: 10 },
          bgcolor: "rgba(0,0,0,0)",
          itemclick: "toggle",
          itemdoubleclick: "toggleothers"
        },
        uirevision: `${datasetSelect.value}-${dimension}-${axes.join("-")}-${viewRevision}`
      };

      if (dimension === 3) {
        const sceneAxis = (axis, values) => ({
          title: { text: `${dataset.labels[axis]} ↑`, font: { color: ink, size: 13 } },
          range: paddedRange(values),
          backgroundcolor: "rgba(0,0,0,0)",
          gridcolor: line,
          zerolinecolor: line,
          tickfont: { color: muted, size: 10 },
          showspikes: false
        });
        layout.scene = {
          bgcolor: "rgba(0,0,0,0)",
          dragmode: "orbit",
          xaxis: sceneAxis(axes[0], rows.map((row) => row.scores[axes[0]])),
          yaxis: sceneAxis(axes[1], rows.map((row) => row.scores[axes[1]])),
          zaxis: sceneAxis(axes[2], rows.map((row) => row.scores[axes[2]])),
          aspectmode: "cube",
          camera: { eye: { x: 1.42, y: 1.52, z: 1.1 } }
        };
      } else {
        layout.xaxis = {
          title: { text: `${dataset.labels[axes[0]]} ↑`, font: { color: ink, size: 13 }, standoff: 16 },
          range: paddedRange(rows.map((row) => row.scores[axes[0]])),
          gridcolor: line,
          zeroline: false,
          tickformat: ".2f",
          tickfont: { color: muted, size: 10 },
          fixedrange: false
        };
        layout.yaxis = {
          title: { text: `${dataset.labels[axes[1]]} ↑`, font: { color: ink, size: 13 }, standoff: 12 },
          range: paddedRange(rows.map((row) => row.scores[axes[1]])),
          gridcolor: line,
          zeroline: false,
          tickformat: ".2f",
          tickfont: { color: muted, size: 10 },
          fixedrange: false
        };
      }

      projectionCount.textContent = String(projectedRows.length);
      fullCount.textContent = String(dataset.fullFrontier.length);
      roster.textContent = `${dataset.roster} / ${dataset.dimensions.length}`;
      routing.textContent = `${dataset.source} · ${dataset.routing} · ${dataset.retainedRows.toLocaleString()} routed rows`;
      projectionLabel.textContent = `${dimension}D projected frontier`;
      frontierList.textContent = projectedRows.map((row) => row.model).join(" · ");
      plotElement.setAttribute("aria-label", `${dataset.label} ${dimension}-dimensional Pareto plot. Selected axes: ${axes.map((axis) => dataset.labels[axis]).join(", ")}. ${projectedRows.length} projected frontier models.`);

      if (!window.Plotly) {
        loading.innerHTML = "<p>Interactive plot unavailable. The static figure above shows the default Arena view.</p>";
        return;
      }

      try {
        await window.Plotly.react(plotElement, traces, layout, {
          responsive: true,
          displaylogo: false,
          scrollZoom: true,
          doubleClick: "reset",
          modeBarButtonsToRemove: ["zoom2d", "lasso2d", "select2d", "autoScale2d", "zoom3d"],
          toImageButtonOptions: { format: "png", filename: `${dataset.label.toLowerCase()}-pareto-${dimension}d`, scale: 2 }
        });
        plotReady = true;
        loading.classList.add("is-hidden");
      } catch (error) {
        loading.classList.remove("is-hidden");
        loading.innerHTML = "<p>The interactive plot could not be rendered. The static figure above remains available.</p>";
        console.error(error);
      }
    };

    redrawPlot = renderPlot;

    datasetSelect.addEventListener("change", () => {
      populateAxes();
      renderPlot();
      announce(`${getDataset().label} selected.`);
    });

    dimensionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        dimension = Number(button.dataset.dimension);
        dimensionButtons.forEach((candidate) => {
          const active = candidate === button;
          candidate.classList.toggle("is-active", active);
          candidate.setAttribute("aria-pressed", String(active));
        });
        zField.hidden = dimension !== 3;
        updateDisabledAxes();
        renderPlot();
        announce(`${dimension}D view selected.`);
      });
    });

    [axisX, axisY, axisZ].forEach((select) => {
      select.addEventListener("change", () => {
        ensureDistinctAxes(select);
        updateDisabledAxes();
        renderPlot();
      });
    });

    if (resetView) {
      resetView.addEventListener("click", () => {
        viewRevision += 1;
        renderPlot();
        announce("Plot view reset.");
      });
    }

    populateAxes();
    renderPlot();

    if ("ResizeObserver" in window) {
      let resizeFrame = 0;
      const resizeObserver = new ResizeObserver(() => {
        if (!plotReady || !window.Plotly || resizeFrame) return;
        resizeFrame = window.requestAnimationFrame(() => {
          resizeFrame = 0;
          window.Plotly.Plots.resize(plotElement);
        });
      });
      resizeObserver.observe(explorer);
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("liang-theme", next); } catch (_) {}
      syncThemeButton();
      redrawPlot();
      announce(`${next === "dark" ? "Dark" : "Light"} mode enabled.`);
    });
  }
})();
