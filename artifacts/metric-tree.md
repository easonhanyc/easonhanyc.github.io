---
layout: doc
title: "Metric trees & scenario forecasting"
description: "Decomposing goals into levers, and forecasting a category with no history."
---

# Metric tree & scenario forecasting — how I structure measurement

> **This is a reconstruction.** The method is the one I used defining success metrics for a new business line at AWS; the numbers and example decomposition below are invented for this portfolio.

---

## Part 1 — Decomposing a goal into a metric tree

The purpose of a metric tree isn't reporting. It's **locating which lever a given team can actually pull**, so that a top-line number becomes somebody's job rather than everybody's concern.

Worked example, on TripMatch's actual goal ("more students find a matching ride"):

```
                    Matches made per week
                              │
              ┌───────────────┴───────────────┐
              │                               │
      Posts created                  Match rate per post
              │                               │
    ┌─────────┴─────────┐         ┌───────────┴───────────┐
    │                   │         │                       │
 New posters    Repeat posters  Liquidity            Discoverability
    │                   │      (overlapping          (can a user find
    │                   │       supply/demand         the overlap that
    │                   │       on a route+date)      already exists?)
    │                   │
 Sign-in          Did their last
 completion       post get a match?
```

Two things this structure buys you:

**It separates the two ways a product can fail.** *Liquidity* failure means the match genuinely isn't there — nobody is driving that route that day. *Discoverability* failure means the match exists and the user didn't find it. These look identical in the top-line number and demand completely different fixes: liquidity needs growth, discoverability needs product. TripMatch's date-chip filter was a discoverability fix, and framing it that way is what made it obviously worth building.

**It exposes the retention loop.** Repeat posting depends on whether the *previous* post got a match. That's not a marketing problem; it's the product's core loop, and it means match rate is upstream of growth, not parallel to it.

---

## Part 2 — Leading vs. lagging, and why the split matters

| | Leading | Lagging |
|---|---|---|
| **Answers** | "Is it working *right now*?" | "Did it work?" |
| **Timescale** | Days | Weeks–months |
| **Use** | Steering | Judging |
| **TripMatch** | Posts/week · % matched within 48h · median time-to-match · first-session activation | Repeat usage rate · preference vs. the WhatsApp chat |

The reason to define both *before* launch: lagging indicators are the ones you'll be judged on, and they're unavailable exactly when you most need to make decisions. Without a pre-agreed leading set, the first weeks get steered by whatever number happens to be handy — usually a vanity one.

---

## Part 3 — Scenario forecasting for a category with no history

The problem: forecasting a **brand-new** business line, where there is no baseline and the honest confidence interval is enormous.

A point forecast is the wrong instrument. It invites false precision, and it moves the conversation onto whether the number is right — which nobody can know — instead of onto which assumptions the org is willing to bet on.

**The structure I used instead** (regression-based model across ~55K data points, four scenarios):

| Scenario | What it encodes | What it's for |
|---|---|---|
| **Conservative** | Adoption follows the slowest comparable prior category | Floor for resourcing commitments |
| **Base** | Adoption follows the median comparable | Default planning assumption |
| **Aggressive** | Adoption follows the fastest comparable | Capacity and staffing risk |
| **Structural break** | The category behaves unlike any prior comparable | Names the possibility the other three assume away |

The fourth scenario is the one most models omit and the one that most often turns out to matter for a genuinely new category. Including it makes the model's central assumption — *"this behaves like something we've seen"* — visible and challengeable rather than buried.

**What this changes about the conversation:** leadership stops asking "is this number right" and starts asking "which of these worlds are we planning for, and what would tell us early which one we're in?" That second question is answerable, and it produces tripwires — specific leading indicators that distinguish the scenarios — which is a materially better input to target-setting than a single number.

---

## The one that generalizes

> **When you can't reduce uncertainty, make it legible instead.** A forecast's job in a new category isn't accuracy — it's forcing the assumptions into the open where they can be argued with and monitored.

---

