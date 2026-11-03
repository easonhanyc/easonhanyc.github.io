---
title: "Spotify Insight Pipeline"
description: "200,013 Spotify app reviews turned into a ranked list of product problems and a recommendation memo, where every number in the memo is filled in by code rather than by a model."
summary: "Where should Spotify put next quarter's effort? The pipeline read 200,013 Google Play reviews, ranked 22 product issues, and wrote a decision memo whose every number comes from code, not from the model. The answer, usability, wins by under 1%, and the memo says so."
role: "Sole builder · MBA 290T — Fundamentals of Agentic AI, final project"
period: "Oct 2026"
depth: "project"
org: "UC Berkeley"
badges: ["Agentic AI", "Final project"]
live: true
tags: ["ai", "analytics", "product", "shipped"]
metrics:
  - n: "200,000"
    l: "reviews classified"
  - n: "22"
    l: "product issues ranked"
  - n: "$4.70"
    l: "total API spend, against a $9 cap"
  - n: "40"
    l: "memo claims traced to a calculation"
links:
  live: "https://spotify-review-insights-iota.vercel.app"
  code: "https://github.com/easonhanyc/mba290t-Multi-Agent-Large-Data-Processing-Pipeline"
featured: false
# Newest work, so it leads the projects after the two featured ones.
order: 2.5
---

**Live:** a public, read-only dashboard with the ranking, the memo and every check behind it · **Data:** 200,013 of 660,622 Spotify reviews from Google Play, 2022–2023

> **The 30-second version.** The question was a product one: if Spotify could fix one area next quarter, which should it be? The pipeline reads 200,013 app reviews, labels each one, ranks the problems by how many people raised them and how badly, and writes a short memo with a recommendation. Language models do the reading. Code does the counting, so every number in the memo can be traced back to the calculation that produced it.

---

## 1. The answer, and how sure it is

The memo recommends **usability**, made up of three problems:

- **Ad interruptions** — 11,233 complaints
- **Shuffle, repeat and queue not working** — 5,685 complaints
- **Navigation and layout changes** — 3,168 complaints

Usability edges out billing and support by **0.8%** on total severity. That margin is small enough that the memo calls its own recommendation **provisional**. It also names what would change the call, and adds a hedge: billing and support grew from 3.8% to 13.9% of reviews year on year, and its biggest single issue is features locked behind Premium.

> A recommendation that wins by under 1% should say so. The memo puts the margin next to the call rather than in a footnote.

## 2. Models read; code counts

The pipeline runs in six stages. Each model answers one narrow question, and code handles everything that has to be exact.

<figure class="dg">
<div class="dgscroll">
<svg viewBox="0 0 700 160" role="img" aria-labelledby="sp-t" xmlns="http://www.w3.org/2000/svg">
<title id="sp-t">Six stages: code ingests the reviews, a model labels them, a second model checks a sample without seeing the first labels, code groups and ranks the complaints, and a model writes the memo while code fills in every number</title>
<g font-family="var(--mono)" font-size="10" text-anchor="middle">
<rect x="10" y="20" width="104" height="66" rx="4" fill="var(--surface)" stroke="var(--border-strong)"/>
<text x="62" y="47" fill="var(--ink)" font-weight="600">INGEST</text><text x="62" y="66" fill="var(--ink-2)">code</text>
<rect x="124" y="20" width="104" height="66" rx="4" fill="var(--surface)" stroke="var(--gold)" stroke-width="1.6"/>
<text x="176" y="47" fill="var(--ink)" font-weight="600">LABEL</text><text x="176" y="66" fill="var(--ink-2)">model</text>
<rect x="238" y="20" width="104" height="66" rx="4" fill="var(--surface)" stroke="var(--gold)" stroke-width="1.6"/>
<text x="290" y="47" fill="var(--ink)" font-weight="600">VERIFY</text><text x="290" y="66" fill="var(--ink-2)">2nd model</text>
<rect x="352" y="20" width="104" height="66" rx="4" fill="var(--surface)" stroke="var(--border-strong)"/>
<text x="404" y="47" fill="var(--ink)" font-weight="600">GROUP</text><text x="404" y="66" fill="var(--ink-2)">code</text>
<rect x="466" y="20" width="104" height="66" rx="4" fill="var(--surface)" stroke="var(--border-strong)"/>
<text x="518" y="47" fill="var(--ink)" font-weight="600">RANK</text><text x="518" y="66" fill="var(--ink-2)">code</text>
<rect x="580" y="20" width="110" height="66" rx="4" fill="var(--accent)"/>
<text x="635" y="47" fill="var(--accent-ink)" font-weight="600">MEMO</text><text x="635" y="66" fill="var(--accent-ink)">words: model</text>
<path d="M114 53 H124 M228 53 H238 M342 53 H352 M456 53 H466 M570 53 H580" stroke="var(--border-strong)" stroke-width="1.4"/>
<text x="350" y="122" fill="var(--ink-2)">EVERY NUMBER IN THE MEMO IS FILLED IN BY CODE, NOT WRITTEN BY THE MODEL</text>
<text x="350" y="148" fill="var(--gold)" font-size="10.5">Outlined in violet: the two steps where a model makes a judgement call</text>
</g>
</svg>
</div>
<figcaption>Models answer narrow questions. Code does the counting, checking and arithmetic.</figcaption>
</figure>

The memo is the clearest example. The model writes the sentences with placeholders, and code fills in each figure from saved results — 40 claims and 128 numbers, each tied to the file it came from. The live dashboard can recompute the ranking and all 40 claims from its database on request.

The same split runs through the grouping step: code decides which complaints belong to which issue, and a model only suggests a readable name for each group.

## 3. Checking the labels before trusting the ranking

A ranking is only as good as the labels under it, so I checked them three ways before using them.

- **50 reviews labelled by hand first.** I labelled them myself, then scored three candidate setups against them and picked the winner by a rule written down before any results came in. On the final run, the model matched my topic label 78% of the time.
- **A second model checked 2,000 reviews blind.** It agreed on the topic for 82% and on what the reviewer wanted for 92%. Where the two disagreed, every case is counted and sorted by type.
- **The quotes are real.** Each label comes with a passage copied exactly from the review, and a blind check found that 89% of sampled quotes support all three labels.

Two deliberate failure tests passed as well: a wrong label planted in a test copy was caught, and 8 of 8 attempts to hijack the model through review text were ignored.

## 4. Cost was part of the design

The project had a hard **$9.00** budget, so spend was tracked call by call rather than checked afterwards. The estimate made before the final run was $2.32 to $4.55. The final run came to **$2.42**, and the whole project, every test run included, came to **$4.70**.

The pipeline can also stop and pick up where it left off. During the final run it was interrupted on purpose after about three minutes, with 36,780 reviews saved. The same command resumed without re-sending a single finished review, and completed all 200,000.
