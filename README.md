# Liang (Twist) Shan — Personal Homepage

Source code for my personal academic website: **[twist-shan.github.io](https://twist-shan.github.io/)**.

The site introduces my background, education, research interests, writing, course notes, and personal interests. It is built with Jekyll and GitHub Pages, with a custom responsive layout, light/dark color modes, and a mint–taro visual palette.

![Homepage preview](images/themes/homepage-light.png)

## Site sections

- **About** — biography, education, CV, social links, and short updates
- **Research** — current work in reinforcement learning and large language models
- **Blog** — notes from research and the learning process
- **Misc.** — course notes and personal interests

## Updating content

The most frequently edited files are:

| Content | File |
| --- | --- |
| Homepage and education | `_pages/about.md` |
| Short Notes | `_data/news.yml` |
| Research projects | `_pages/research.md` |
| Blog landing page | `_pages/blog.md` |
| Blog posts | `_posts/` |
| Course notes and interests | `_pages/misc.md` |
| Navigation | `_data/navigation.yml` |
| CV | `files/cv.pdf` |
| Site-wide settings | `_config.yml` |
| Custom visual styles | `assets/css/studio.css` |

Short Notes are stored in reverse chronological order in `_data/news.yml`:

```yml
- date: "2026.03"
  text: "This personal website went live."
  link: ""
```

Only the latest three notes are shown on the homepage. Leave `link` empty for a plain update, or add a URL to make the note clickable.

## Running locally

Install Ruby and Bundler, then run:

```bash
bundle install
bundle exec jekyll serve --livereload
```

Open [http://localhost:4000](http://localhost:4000) in a browser. Changes to `_config.yml` require restarting the server.

Docker is also supported:

```bash
docker compose up
```

## Publishing

Changes pushed to the default branch are deployed automatically by GitHub Pages.

```bash
git status
git add .
git commit -m "Update personal homepage"
git push origin master
```

## Credits

This website began with the [Academic Pages](https://academicpages.github.io/) template and has since been extensively customized. The project remains subject to the terms in [LICENSE](LICENSE).
