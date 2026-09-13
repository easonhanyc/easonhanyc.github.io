---
title: "AWS Sales Insights Platform"
description: "0-to-1 launch of an action-oriented insights platform for 10,000 sellers."
summary: "AWS Sales was not short on data. It was short on conclusions. I owned the end-to-end launch of the org's first action-oriented insights platform \u2014 interviews, PRD, Figma, roadmap."
role: "Product owner \u00b7 AWS Global Sales Strategy & Analytics"
period: "Jul 2023 – May 2026"
badges: ["0 \u2192 1 at scale"]
live: false
tags: ["product", "ai"]
metrics: 
  - n: "70%"
    l: "less time-to-insight"
  - n: "10,000"
    l: "sellers served"
  - n: "56→82%"
    l: "on-time request delivery"
  - n: "$80B"
    l: "business supported"
links: 
  prd: "/artifacts/prioritization-framework"
featured: true
order: 2
---

**Role:** Product owner (BIE, AWS Global Sales Strategy & Analytics) · **Timeline:** Jul 2023 – May 2026 · **Scale:** 10,000+ sellers, $80B business

> **Confidentiality note.** This case study is written at the level of detail already public on my resume. Internal system names, screenshots, and proprietary data are omitted. Where an artifact appears below it is a **reconstruction built for this portfolio** to show method, not a copy of internal material — each is labeled as such.

> **The 30-second version.** AWS Sales had extensive dashboards and almost no *decisions* coming out of them. I owned the end-to-end launch of the org's first action-oriented insights platform — user interviews through PRD, Figma mockups, and roadmap prioritization — cutting time-to-insight by 70% for 10,000+ sellers. It replaced a manual 5–10 dashboard workflow with the **Action Hub**: one ranked account list carrying a recommended next action on every account. The core product bet: sellers didn't need more data access, they needed the *next action* named for them.

| | |
|---|---|
| **Problem** | Sellers had dashboards but no prescribed action; insight-to-action was slow and inconsistent |
| **My role** | End-to-end: discovery, PRD, mockups, roadmap prioritization, stakeholder alignment, launch |
| **Outcome** | 70% reduction in time-to-insight · 10,000 sellers served · self-service adoption to 6,000 users, 20,000+ views |
| **Adjacent win** | 0-to-1 Business-Influence Tracker: +12% customer opportunity coverage, promoted to a standing Monthly Business Review KPI |

---

## 1. The problem: a reporting org that produced reports, not decisions

AWS Sales was not short on data. It was short on *conclusions*. The pattern I kept hitting as a BIE:

- A seller works through five to ten dashboards and has to determine for themselves which number implies they should do something today.
- The org's analytics function absorbed the gap by fielding one-off data requests — which is a slow, unscalable, and unsatisfying substitute for a product.
- The backlog of those requests was the clearest available signal that the self-service tooling wasn't self-service in practice.

**The reframe:** the bottleneck was never data *access*. Sellers already had access. The bottleneck was the translation step between "here is a number" and "here is what you should do about it," and that translation was being done manually, by analysts, one seller at a time.

That reframe is what turned a dashboard request into a product.

---

## 2. Discovery: what user interviews actually changed

I ran **20 user interviews** with sellers across segments before writing requirements, then scoped the build from a PRD and Figma prototypes. Two findings changed the design:

**Finding 1 — Sellers didn't distrust the data; they distrusted their own reading of it.** The hesitation wasn't "is this number right," it was "am I looking at the right number." That pointed away from *more* visualization and toward *fewer, ranked, prescribed* surfaces.

**Finding 2 — The unit of work is an account, not a metric.** Dashboards were organized by metric (pipeline, coverage, attainment) because that's how the analytics org thinks. Sellers think in accounts. Reorganizing around the seller's actual unit of work removed a mental translation step that was happening on every single visit.

This is the discovery principle I'd carry into any PM role: **the org's internal information architecture leaks into the product, and users pay for it.**

---

## 3. Prioritization: how the roadmap got cut

The initial ask was substantially larger than what shipped first. I ran prioritization against three questions, in this order:

1. **Does this change what a seller does today?** Anything that only changed what a seller *knew* went below the line. This is what "action-oriented" meant in practice, and it was the sharpest cut available.
2. **Does this work without a data-engineering dependency?** Features requiring new upstream pipelines carried timeline risk owned by another team. Those were sequenced later, deliberately, so v1's ship date depended only on my own execution.
3. **Does it survive the seller's actual context?** Sellers are mobile, time-boxed, and interrupted. A feature requiring a ten-minute focused session was mis-designed regardless of its value.

→ *[Reconstructed prioritization framework](/artifacts/prioritization-framework) — the method, on generic example features*

---

## 4. Execution: the part most PM portfolios skip

**Roadmap reviews as the alignment mechanism.** I established recurring roadmap reviews that published the backlog and aligned engineering and business stakeholders on sprint priorities. The measurable result: **on-time delivery of business stakeholder requests rose from 56% to 82%.**

That number is worth unpacking, because it's the one I find most interesting. Delivery improved not primarily because we processed requests faster, but because the review forum turned *recurring* requests into *roadmap items*. A request that shows up three times is a missing feature wearing a disguise. The metric moved when the intake process started distinguishing between the two.

**Adoption is a product problem, not a comms problem.** Driving self-service analytics adoption to 6,000 users across an $80B business (20,000+ views) was not accomplished by announcements. It came from treating unused tooling as a product defect and following the same discovery loop.

The clearest version of that: partnering with sales leadership on a **gamified GenAI adoption program across LATAM for 1,100 sellers**, iterating on user feedback to exceed **75% participation within 60 days**. The lesson that generalizes — when adoption is the goal, the *feedback loop tightness* matters more than the incentive size.

---

## 5. Adjacent 0-to-1: the Business-Influence Tracker

A second product built end-to-end: a tracker that surfaced which customer opportunities were being influenced but not captured in existing coverage reporting.

- **Outcome:** +12% customer opportunity coverage
- **The signal I'd point to:** it became a **standing Monthly Business Review KPI**

The second bullet matters more than the first. A shipped feature is a feature; a metric that leadership adopts into its recurring operating review has changed how the org steers. **That's the durable version of product impact** — the tool outlived the launch because the number it produced became part of how the business runs.

---

## 6. Measurement: defining success for a GenAI business

I defined success metrics for AWS Sales' FY-2024 Generative AI business using a regression-based forecasting model across **55,000 data points and four scenario simulations**, informing leadership target-setting.

The PM-relevant part is the scenario structure, not the regression. Point forecasts for a brand-new category invite false precision — nobody knew the shape of GenAI demand in FY-2024. **Four scenarios force the conversation to be about which assumptions leadership is willing to bet on**, rather than about whether a single number is right. That's a materially better input to target-setting.

→ *[Reconstructed metric tree](/artifacts/metric-tree) — the decomposition method, on a generic example*

---

## 7. What I'd do differently

- **I under-invested in instrumenting the "action taken" step.** Time-to-insight was measurable and improved 70%. Whether a seller *acted* on the surfaced insight was much harder to observe, and I'd have designed for that measurement from the start rather than inferring it from downstream metrics.
- **I sequenced data-engineering dependencies out of v1 for schedule safety — correctly — but didn't push hard enough on the joint roadmap afterward.** Deferred dependencies have a way of staying deferred once v1 succeeds without them.
- **Access management came late.** I built the centralized access-management app end to end — replacing risk-prone spreadsheets with auditable data-access controls for 200+ data owners and strategy & ops partners — through spec-driven development in the Kiro agentic IDE. Writing the spec first and letting the agent build against it is the same discipline as writing the PRD before the code, which is why it worked. But it solved a compliance gap as a reaction rather than a design input, and governance is cheaper to build in than to retrofit.

---
