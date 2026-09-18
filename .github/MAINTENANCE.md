# Repository and build pipeline

## Normal workflow

1. Edit the source and preview locally with `bundle exec jekyll serve`.
   On Windows with a non-ASCII repository path, use `./scripts/jekyll-local.ps1 serve`.
2. Open a pull request to `master`. `Site CI / Build site` installs the locked
   Ruby dependencies, builds in production safe mode, and checks public entry points.
3. Review the change and CI result, then merge. GitHub Pages continues to publish
   from `master` at `/` using the existing branch deployment setting.

CI also runs on pushes to `master` and manual dispatch. It is read-only, cancels
superseded runs, and never commits generated files. It does not replace or gate
the GitHub-managed Pages deployment. Requiring the PR check would be a separate
branch protection setting; direct pushes can still deploy independently of CI.

## Source ownership

| Area | Source |
| --- | --- |
| About, Research, Blog, Misc | `_pages/` |
| News and navigation | `_data/news.yml`, `_data/navigation.yml` |
| Blog routes and metadata | `_posts/` |
| Tokenization and Optimizer page bodies | `_layouts/tokenization.html`, `_layouts/optimizer.html` |
| Blog source notes and companion code | `posts/` |
| Main theme | `_layouts/studio.html`, `_includes/studio-*.html`, `assets/css/studio.css`, `assets/js/studio.js` |
| Downloads | `files/` |
| Shared build configuration | `_config.yml`, `Gemfile`, `Gemfile.lock` |

The two long blog layouts contain their own rendered article bodies. Editing a
Markdown note alone does not regenerate them. Preserve both representations.

Legacy collections, layouts, Sass, map assets, and CV JSON still have public
routes or references. Keep them until a separate content-removal decision is made.
The legacy npm task is only for rebuilding `assets/js/main.min.js`; normal Jekyll
builds use the committed asset and do not need npm. Python/notebook utilities are
manual content tools, not prerequisites of the website build.

## Reproducibility and verification

Use Ruby 3.3 and the committed lockfile for local/CI builds. Run `bundle install`,
not an unconditional dependency update. The lock includes Windows and Linux.
For intentional dependency changes, update the lock, inspect the dependency diff,
and run a complete build. GitHub's branch-based Pages service manages its own
runtime, so the local lock does not pin the hosted service's entire environment.

```sh
JEKYLL_ENV=production bundle exec jekyll build --safe --trace
bundle exec ruby .github/scripts/check-site.rb
```

`_site`, Sass/Jekyll caches, and installed dependencies are local outputs and must
not be committed. Keep CI helpers here under `.github/`, which Jekyll already
excludes from publication. Docker remains an optional local development setup.

Removed during pipeline cleanup: the template's automatic talk-location scrape
and template-upstream bug/feature issue forms. Existing map output is preserved.

Action configuration references: [checkout](https://github.com/actions/checkout)
and [setup-ruby](https://github.com/ruby/setup-ruby).
