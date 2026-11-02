# Liang (Twist) Shan — Personal Homepage

Jekyll website with separate Home, Research, Blog and Misc pages. The academic redesign is the default theme, with responsive layouts, light/dark themes and pointer-following headings.

## Editing content

| Content | Source |
| --- | --- |
| Biography, Education, profile links, Contact | `_pages/about.md` |
| News | `_data/news.yml` |
| Research projects, authors and advisors | `_data/research.yml` |
| Research presentation | `_pages/research.md` |
| Blog listing (automatically lists all posts) | `_pages/blog.md` |
| Article metadata and personal essays | `_posts/` |
| Tokenization and optimizer article bodies | `_layouts/tokenization.html`, `_layouts/optimizer.html` |
| Interests and notes | `_pages/misc.md` |
| CV | `files/cv_Liang_Shan.pdf` |
| Main styles and behavior | `assets/css/studio.css`, `assets/js/studio.js` |
| Shared article styling | `assets/css/article.css` |
| Research icons | `_includes/research-marks/` |

Add `authors` (name, optional url, optional self: true) to a paper in research.yml. Entries without authors show their advisor instead. `draft: true` hides a project or domain. Resources stay in their configured order.

Blog front matter uses `blog_category: research`, `notes` or `others`, and optional `reading_minutes`. Only research articles with an existing citation section show Cite. The four interactive technical articles retain their original scripts and assets under `posts/`.

## Local preview

Install dependencies with `bundle install`. On Windows run:

```powershell
./scripts/jekyll-local.ps1 build --safe --trace
./scripts/jekyll-local.ps1 serve
```

On other systems: `bundle exec jekyll serve`. Open http://localhost:4000.

## Publishing

The maintained branch is `master`. GitHub Pages deploys changes pushed to it. CI builds with Jekyll safe mode and checks published entry points.

```sh
git status
git add .
git commit -m "Update homepage"
git push origin master
```

The site originated from Academic Pages; see LICENSE. Legacy collection templates remain available for existing URLs. Design preview files are not part of the published source.
