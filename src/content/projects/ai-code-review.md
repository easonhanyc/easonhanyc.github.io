---
title: "AI Code-Review Automation"
description: "Shipping an agentic AI tool inside a large engineering org."
summary: "The judgment that mattered wasn't the model \u2014 it was deciding which parts of the review the tool was allowed to be wrong about. False positives spend reviewer trust non-renewably."
role: "Builder and product owner \u00b7 Amazon internal agentic-AI platform"
period: "2024\u20132026"
badges: ["Agentic AI"]
live: false
tags: ["ai", "product"]
metrics: 
  - n: "80%"
    l: "less manual processing"
  - n: "Precision"
    l: "chosen over recall"
links: {}
featured: true
order: 3
---

**Role:** Builder and product owner · **Context:** Amazon internal agentic-AI platform · **Outcome:** 80% reduction in manual processing time

> **Confidentiality note.** Written at the level already public on my resume. No internal code, prompts, system names, or proprietary workflow detail. The generalizable method is the point.

> **The 30-second version.** Engineering release workflows carried a manual review step that was slow, repetitive, and inconsistently applied. I shipped an AI-powered code-review automation tool on Amazon's internal agentic platform that cut manual processing time by 80%. The product judgment that mattered wasn't the model — it was deciding which parts of the review the tool was allowed to be wrong about.

| | |
|---|---|
| **Problem** | A manual review step gating engineering releases: slow, repetitive, inconsistent between reviewers |
| **Outcome** | 80% reduction in manual processing time; accelerated release workflows |
| **Core decision** | Scope the tool to high-volume/low-ambiguity review classes; route genuine judgment calls to humans |

---

## 1. The problem: review as a queue, not a conversation

A meaningful share of the review load wasn't design discussion. It was **checking** — convention adherence, repeated classes of defect, the same comment written for the hundredth time. That work has three bad properties:

1. **It's high-volume and low-variance** — the same handful of findings recur constantly.
2. **It's inconsistently applied** — whether a given issue gets caught depends on which reviewer picked up the queue and how busy they were.
3. **It's a poor use of the reviewer** — it crowds out the architectural feedback only a human can give.

**That combination — high volume, low ambiguity, consistency problems — is close to the ideal profile for automation.** Note that this is a scoping conclusion, not a modeling one. The hard product work was identifying *which slice* of review had that profile.

---

## 2. The central decision: what the tool is allowed to be wrong about

The failure mode I designed against was **not** "the model misses something." It was **the model being confidently wrong on judgment calls, and reviewers learning to ignore it.** A review tool that cries wolf gets muted, and a muted tool is worse than no tool — it has consumed the org's attention budget and returned nothing.

So the scoping rule was:

> **Automate the classes of finding where a correct answer is checkable. Route everything requiring genuine judgment to a human, and make the handoff explicit rather than silent.**

Two consequences worth naming:

- **Precision beats recall for this product.** A missed finding costs what the status quo already cost. A false positive costs reviewer trust — which is the only asset the tool has and the one that doesn't recover.
- **The tool's confidence must be legible.** A reviewer needs to know instantly whether they're looking at a mechanical check or a suggestion. Presenting both in the same voice is what trains people to ignore the whole surface.

---

## 3. Why the 80% number is what it is

The 80% reduction in manual processing time comes from removing the *repetitive* portion of review, not from replacing review. That distinction matters for how the result should be read:

- The remaining 20% is disproportionately the **hard** part — architecture, intent, tradeoffs — which is exactly the work you want a senior engineer spending time on.
- The gain compounds through **release velocity**, because the bottleneck wasn't total review effort so much as review *latency*: a PR waiting on a reviewer to get to the mechanical pass.

**Removing a queue's cheapest work speeds the queue more than the raw time saved suggests**, because it removes a class of wait that was blocking on human availability rather than on human thought.

---

## 4. What this taught me about AI products

Three things I'd bring to an AI PM role:

**1. The product question is almost never "can the model do this."** It's "what is the cost asymmetry between the two failure directions, and does the interface make that asymmetry visible to the user?" For code review, false positives are far more expensive than false negatives — and that single observation determined the scope, the thresholds, and the UI.

**2. Trust is the scarce resource, and it's spent non-renewably.** Users give a new AI tool a short evaluation window. Findings that waste it are not neutral; they permanently reduce the attention the tool receives afterward. Shipping narrow and correct beats shipping broad and noisy, even when broad-and-noisy scores better on aggregate benchmarks.

**3. Adoption depends on where the output lands.** A tool that requires a context switch competes with the reviewer's existing habits and loses. Meeting the user inside the workflow they already have is worth more than a substantial accuracy improvement.

---

## 5. What I'd do differently

- **I'd have instrumented reviewer overrides from day one.** Every time a human dismisses a finding, that's a labeled example of the tool's precision problem — the highest-value feedback signal available, and the easiest to lose by not capturing it.
- **I'd have defined an explicit "retire this check" path.** Automated checks accumulate. Without a mechanism for removing ones that stop earning their noise, the tool's precision degrades slowly and invisibly.

---

*Related: my [MBA 290T — Fundamentals of Agentic AI](/) coursework at Berkeley covers the agent-design patterns underlying this work. [TripMatch](/work/tripmatch) is the corresponding end-to-end build.*
