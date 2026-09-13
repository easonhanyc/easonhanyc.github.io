# easonhanyc.github.io

The source for **[easonhanyc.github.io](https://easonhanyc.github.io)** — a product portfolio built
with Astro and deployed to GitHub Pages.

**This README is about how the site is built.** The writing, case studies and PRDs are on
[the site itself](https://easonhanyc.github.io); duplicating them here would just create two copies
to keep in sync.

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 7** | Content-first. Ships zero JavaScript by default and adds it per component, which suits a site that is mostly long-form prose with a few interactive moments. |
| Content | **Content collections** (`glob` loader + Zod schemas) | Every project and artifact is one Markdown file with typed front matter. A missing or malformed field fails the build instead of rendering a broken page. |
| Markup | **MDX** (`@astrojs/mdx`) | Markdown for the prose, with the option of components where a page needs one. |
| Styling | **Plain CSS, custom properties** | The whole design system is ~270 lines. A framework would have been more code than the thing it replaced. |
| Type | Instrument Sans · Source Serif 4 · JetBrains Mono | Display / long-form prose / spec labels. Serif body text is deliberate — a portfolio whose pitch is "I write the PRD" should read like a document. |
| Hosting | **GitHub Pages** via GitHub Actions | Static, free, and the build step runs in CI rather than being committed. |

Palette is Berkeley blue `#003262` and California gold `#c99700`, carried over from the previous
version of this site.

## Content model

```
src/content/
  projects/*.md     title, summary, role, period, badges, tags[],
                    metrics[{n,l}], links{live,code,prd}, featured, order
  artifacts/*.md    title, description, kind, related, order
```

Schemas live in [`src/content.config.ts`](src/content.config.ts).

**To add a project:** drop a Markdown file into `src/content/projects/`. The filename becomes the
URL slug, the front matter drives the card on `/work`, and `tags` decides which filters it appears
under. Nothing else needs editing — no index to update, no nav entry to add.

`related` on an artifact links it back to a project, which is what renders the "working documents"
section at the foot of a case study.

## Routes

```
/                        cinematic home
/work                    filterable index
/work/[slug]             case study
/artifacts               index
/artifacts/[slug]        working document
/about                   background
404
```

## Motion, built in tiers

The scroll treatment is layered so that it degrades instead of breaking. Each tier assumes less than
the one above it.

| Tier | Technique | Needs | If unavailable |
|---|---|---|---|
| 1 | Typography, full-bleed panels, `position: sticky` pinning | nothing | — |
| 2 | Staggered reveal on scroll | `IntersectionObserver` | content renders in place |
| 3 | Scroll-driven reading progress | `animation-timeline: scroll()` | bar is simply absent |

Two rules hold the whole thing together:

**Content ships visible.** `.rv` elements are fully opaque by default. JavaScript adds a `js-rv`
class to `<html>`, and *that* class is what introduces the hidden start state. So if the script
fails, never runs, or is blocked, the page renders complete rather than blank — the failure mode of
parking content at `opacity: 0` and waiting for an observer that never fires.

**Tier 3 is genuinely optional.** It sits behind `@supports (animation-timeline: scroll())` because
Firefox stable still gates the feature behind a flag. It only ever drives decoration, never whether
something is readable.

`prefers-reduced-motion: reduce` collapses every tier: the pinned section becomes a normal stacked
grid, reveals resolve instantly, and the progress bar is hidden.

## Implementation notes

**Three theme states, not two.** An explicit choice stamps `data-theme` on the root element, but the
default "system" setting stamps nothing — so the un-stamped document is the common case. Tokens are
therefore defined three times: the bare `:root` block carries the complete light palette,
`@media (prefers-color-scheme: dark)` redefines them guarded by `:not([data-theme="light"])` so an
explicit light choice beats a dark OS, and `:root[data-theme="dark"]` redefines them again so the
toggle wins in the other direction. A small inline script applies the stored choice before first
paint, so switching themes never flashes the other palette.

**Wide tables scroll instead of pushing the page.** Markdown tables carry a minimum width so columns
stay readable, which on a phone would drag the whole document sideways. Rather than wrapping every
table with a build plugin or a script, the table is its own scroll container:

```css
.prose table { display: block; width: max-content; max-width: 100%; overflow-x: auto; }
```

**The pinned section checks viewport height.** Below 560px tall it stays unpinned, because a sticky
full-height stage clips its own content on a short screen.

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview    # serve the build
```

## Deployment

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
`actions/configure-pages` (with `enablement: true`, so Pages turns itself on), then
`withastro/action` to build, then `actions/deploy-pages` to publish.

Pages must be set to deploy from **GitHub Actions** rather than from a branch — the site is built in
CI, and `dist/` is not committed.

## Structure

```
src/
  content.config.ts        collection schemas
  content/                 projects/ and artifacts/ Markdown
  layouts/BaseLayout.astro head, theme bootstrap, reveal observer
  components/              Nav · Footer · PinnedStory · ProjectCard · WorkGrid
  pages/                   routes
  styles/global.css        tokens and the whole design system
```

## Known gaps

- **No automated tests.** The build catches schema and link errors; layout and motion were verified
  by hand across viewport widths, themes, reduced-motion, and with JavaScript disabled. A Playwright
  pass over those states would make it repeatable.
- **No images.** The site is entirely type and layout. Screenshots of the products would help, and
  would mean introducing `astro:assets` and a real image pipeline.
- **The pinned section is a scroll-position calculation,** not a native scroll timeline. It could
  move to `animation-timeline: view()` once Firefox ships it unflagged, which would remove the
  scroll listener entirely.
