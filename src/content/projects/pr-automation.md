---
title: "AI Pull-Request Automation"
description: "Automating the repo-to-production push with an agentic skill, and why release automation is not review automation."
summary: "An AI-powered pull-request automation skill that took the repo-to-production push off people's hands, cutting manual processing time by 80%. Automating a path to production inverts the failure asymmetry most AI tooling is designed around."
role: "Builder and product owner · Amazon internal agentic-AI platform"
period: "AWS · 2023–2026"
badges: ["Agentic AI"]
live: false
tags: ["ai", "product", "eng"]
metrics:
  - n: "80%"
    l: "less manual processing time"
  - n: "Repo → prod"
    l: "push path automated"
links: {}
featured: false
order: 3
---

**Role:** Builder and product owner · **Context:** Amazon internal agentic-AI platform · **Outcome:** 80% reduction in manual processing time

> **Confidentiality note.** This page is written at the level of detail already public on my resume. No internal code, prompts, system names, pipeline topology, or proprietary workflow detail appears here. What generalizes is the reasoning, so that is what I have written down.

> **The 30-second version.** Getting a reviewed change from the repository to production carried a sequence of manual steps — individually small, individually easy, and collectively a queue. I shipped an AI-powered pull-request automation skill that automates the repo-to-production push, cutting manual processing time by **80%**.

---

## 1. The work automation was pointed at

Release paths accumulate steps the way desks accumulate paper. Each one was added for a reason, each is quick, and none of them is interesting. The resulting profile is the one worth recognising:

1. **High volume, low variance.** The same sequence, repeated per change.
2. **Cost is latency, not difficulty.** Nothing in the path is hard. The expense is that each step waits on a person being free to perform it.
3. **Inconsistency is invisible.** A step done slightly differently under time pressure usually goes unnoticed until something breaks.

That third property is why "just write a runbook" does not solve it. A runbook describes the steps; it does not perform them, and the gap between the two widens exactly when the team is busiest.

## 2. Why automating a push is not like automating a review

This is the part I would actually argue in an interview, because the intuition most people carry over from AI review tooling is backwards here.

A review tool that is wrong produces a bad comment. A human reads it, disagrees, moves on. The cost is attention, and it is paid by one person.

**A release tool that is wrong produces a bad deployment.** The failure does not land in someone's inbox — it lands in production.

That inverts the asymmetry:

| | Review automation | Release automation |
|---|---|---|
| Expensive failure | False **positive** — a wrong finding spends reviewer trust | False **negative** — a bad change waved through |
| Where it lands | A reviewer's attention | Production |
| Optimise for | Precision | Not letting the wrong thing pass |

So the design question is not "how accurate is the model." It is **which steps an agent may complete unattended, which keep a human gate, and how fast a wrong outcome can be undone.**

**Reversibility is the real design budget.** An automated step whose failure can be rolled back in seconds earns trust far earlier than an equally accurate step that cannot. Accuracy determines how often you are wrong; reversibility determines what being wrong costs. Only the second one is under your control at design time.

## 3. The 80% is a latency number, not an effort number

The reduction comes from removing the repetitive portion of the push, and it reads better as queue behaviour than as time saved:

- The manual steps were blocking on **human availability**, not human thought. Removing a wait of that kind speeds the path by more than the raw minutes it consumed.
- What remains is disproportionately the part that genuinely needs a person — judgment about whether this change should go out now.

**Removing a queue's cheapest work speeds the queue more than the arithmetic suggests.**

## 4. What I would carry into an AI PM role

**The question is rarely "can the model do this."** It is: what is the cost asymmetry between the two failure directions, and does the design make that asymmetry visible to the person relying on it?

**Trust is spent non-renewably.** A tool that causes one bad deployment does not get graded on its average. People route around it afterwards, and the automation's value goes to zero while its maintenance cost does not.

**Adoption depends on where the output lands.** Automation that requires a context switch competes with an existing habit and loses. Meeting people inside the workflow they already have is worth more than a large accuracy improvement.

---

*Sibling work: the [access-management app](/work/aws-insights-platform) was built through spec-driven development in the Kiro agentic IDE — the same discipline as writing the PRD before the code. [TripMatch](/work/tripmatch) is the corresponding end-to-end build outside work.*
