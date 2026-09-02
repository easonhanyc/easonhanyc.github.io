# Eason Han — Product Management Portfolio

**🌐 Read it as a site: [easonhanyc.github.io](https://easonhanyc.github.io)** ← the version to send a recruiter

MBA / MEng candidate at **UC Berkeley Haas & IEOR**. Three years at **AWS** building analytics products for an $80B sales org — then I started shipping my own. I write the PRD, cut the roadmap, and build the thing.

📧 [eason_han@berkeley.edu](mailto:eason_han@berkeley.edu) · 💼 [LinkedIn](https://www.linkedin.com/in/yichen-eason-han/) · 🚗 [TripMatch, live](https://tripmatch-app.github.io/)

---

## Case studies

### 1. [TripMatch](case-studies/tripmatch.md) — 0→1, shipped and live
*Sole PM, designer, and engineer · 6 days to public launch*

A 400-person cohort coordinated rides by scrolling a WhatsApp chat. I shipped a verified, Berkeley-only rides board — PRD through production. The decision I'd point to: **I rebuilt my own v1 architecture the day before launch** after finding three defects that would have broken it inside its own expected load, including a race condition that silently deleted users' posts.

`34 commits in 6 days` · `168 automated checks` · `3 feedback-driven iterations` · [**Try it live**](https://tripmatch-app.github.io/)

### 2. [AWS Sales Insights Platform](case-studies/aws-insights-platform.md) — 0→1 at scale
*Product owner · AWS Global Sales Strategy & Analytics · 2023–2026*

AWS Sales had extensive dashboards and almost no *decisions* coming out of them. I owned the end-to-end launch of the org's first action-oriented insights platform — interviews, PRD, Figma, roadmap. The product bet: **sellers didn't need more data access, they needed the next action named for them.**

`70% less time-to-insight` · `10,000 sellers` · `data-request resolution 56% → 82%` · `$80B business`

### 3. [AI Code-Review Automation](case-studies/ai-code-review.md) — AI product judgment
*Builder and product owner · Amazon internal agentic-AI platform*

Shipped an agentic tool that cut manual review time by 80%. The judgment that mattered wasn't the model — it was deciding **which parts of the review the tool was allowed to be wrong about.** For code review, false positives cost reviewer trust, and trust is spent non-renewably.

`80% less manual processing` · `precision chosen over recall`

---

## Artifacts

The working documents, not just the summaries — so the reasoning is inspectable.

| Artifact | What it shows |
|---|---|
| [**TripMatch PRD**](artifacts/tripmatch-prd.md) | Problem framing, non-goals, user stories, P0/P1/P2 requirements with acceptance criteria, success metrics, and the open questions I never closed |
| [**Pre-launch architecture review**](artifacts/tripmatch-infrastructure.md) | What would have broken, at what load, and why I rebuilt the storage layer before launch instead of after |
| [**Prioritization framework**](artifacts/prioritization-framework.md) | Four ordered gates for cutting a roadmap — and why scoring an incomparable list is theater |
| [**Metric trees & scenario forecasting**](artifacts/metric-tree.md) | Separating liquidity failure from discoverability failure, and forecasting a category with no history |

---

## How I work

**Non-goals are the product decision.** TripMatch shipped in six days because I wrote down what it would never do — no payments, no dispatch, no native app, no WhatsApp replacement — before writing any code.

**I'd rather kill my own work than ship a known defect.** The easy path the day before TripMatch's launch was to ship. Instead I rebuilt the storage layer, because the version I'd already built would have silently deleted users' posts under exactly the load launch day produces.

**I write the limitations down.** Every case study ends with what I'd do differently, and the PRD carries its unresolved questions in the open. A portfolio that only contains wins isn't evidence of judgment — it's evidence of editing.

---

## Background

| | | |
|---|---|---|
| **UC Berkeley** — Haas & IEOR | MBA / M.Eng. Industrial Engineering & Operations Research | Expected 2028 |
| **Amazon Web Services** | Business Intelligence Engineer, Global Sales Strategy & Analytics | 2023–2026 |
| **TikTok** | Ads Risk Integrity Intern — 35% reduction in high-risk ad exposure | 2021 |
| **IDG Capital** | Venture Capital Analyst Intern — supported 3 investment decisions | 2020 |
| **University of Notre Dame** | B.B.A. Business Analytics · B.S. Applied Mathematics | 2023 |

**Product** — PRD writing, MVP definition, roadmapping, backlog prioritization, user research, metric design
**Technical** — SQL, Python, R, JavaScript, Tableau, QuickSight, Figma, Salesforce, Cloudflare Workers/D1
**Certified** — AWS AI Practitioner, AWS Data Engineer Associate, Tableau Certified Data Analyst

---

## About this repo

This repository *is* the portfolio. [`index.html`](index.html) plus a Jekyll layout render it as a site on GitHub Pages; the case studies and artifacts are plain Markdown so they stay readable here on GitHub too.

```
├── index.html              the one-page site (the 60-second skim)
├── case-studies/           three deep dives
├── artifacts/              PRD, architecture review, frameworks
├── _layouts/doc.html       shared layout for the Markdown pages
└── assets/style.css        one stylesheet for the whole site
```
