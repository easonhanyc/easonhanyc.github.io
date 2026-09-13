---
title: "Job Search Agent"
description: "A daily scanner for Summer 2027 PM internships — and a lesson in why ranking mattered more than matching."
summary: "Scans roughly 29,400 postings in about 50 seconds every weekday, and opens a GitHub issue only when something new appears. The hard problem turned out not to be finding roles — it was deciding which two per company were worth your attention."
role: "Sole engineer"
period: "Sep 2026"
depth: "project"
org: "Independent"
badges: ["Automation", "Runs daily"]
live: false
tags: ["eng", "shipped"]
metrics:
  - n: "~29,400"
    l: "postings per scan"
  - n: "50s"
    l: "full scan time"
  - n: "2"
    l: "roles shown per company"
  - n: "0"
    l: "secrets to rotate"
# Repo is private, so no source link — a 404 is worse than no link.
links: {}
featured: false
order: 11
---

**Role:** Sole engineer · **Runs:** every weekday at 12:00 PT on GitHub Actions · **Note:** repository is currently private

> **The 30-second version.** I built the tool that runs my own internship search. It scans a large registry of US technology companies every weekday, filters for Summer 2027 PM and MBA internships, and opens a GitHub issue only when something *new* appears. The engineering was straightforward. The product decisions were not.

---

## 1. The decision I'd point to: ranking, not matching

The naive version shows every matching role. That version is unusable, and the reason is instructive.

Big hirers post in bulk — TikTok can list a dozen qualifying roles at once. Show everything and one company crowds out the other hundred, which is precisely backwards: the point of scanning broadly is to surface the companies you'd otherwise miss.

So each company shows its **two most relevant postings**, and the rest collapse into a "+N more" link.

That cap forces a ranking problem, and my first weighting was wrong. With flatter weights, a business-development role tagged *(MBA)* outscored an actual Product Manager internship and took its slot. The fix was to make the product-role signal **deliberately dominant** — weight 100, against 45 for "explicitly hires MBAs" and 15 for strategy/BizOps.

> The collapsed roles are one click away. The two that survive have to be right, because they are the only two that get read.

## 2. Matching on titles, not descriptions

I tried matching against posting descriptions and abandoned it. Nearly every full-time posting says "MBA preferred" somewhere, which made *Enterprise Account Executive* look like an MBA internship.

Only a narrow set of high-signal phrases — "MBA students", "pursuing an MBA" — can promote a role from its description, and only when the title already indicates an internship. Similarly, a bare "MBA" in a title isn't enough on its own; that let full-time post-MBA roles through.

Matching is pure keyword rules. **No LLM, no API key, no per-run cost** — the filtering problem is well-specified enough that a model would add expense and nondeterminism without adding accuracy.

A related finding: career-site search is unreliable enough to be worth bypassing. A Workday search for "product manager intern" returned *Lead Backend Software Engineer*. So the adapters fetch broad posting lists and filtering happens locally, where I can see and test it.

## 3. Silence has to be trustworthy

The product promise is "silence means nothing new." That only works if silence can never also mean *quietly broken* — so a Monday health email and an immediate failure alert distinguish the two.

The failure mode that taught me this was a scheduling bug. GitHub fires scheduled workflows late — I observed one 3.5 hours late. My original gate matched an exact hour, so that run **skipped the day's scan while still reporting success**. A silent miss is worse than a loud failure, because nothing prompts you to look.

The gate is now "at or after noon Pacific, if today has not already run," with the answer coming from committed run logs. A late fire still runs, the second scheduled hour finds the day done and skips, and no day can be lost without a trace.

## 4. Choosing a delivery channel with no secrets

Delivery is a GitHub issue, not an email. Actions injects `GITHUB_TOKEN` automatically, so there is **nothing to configure and nothing to rotate** — and GitHub emails you when an issue opens on your own repo, so the notification still lands in your inbox. Each scan that finds something leaves a labelled issue, which gives the whole search a browsable history for free.

The SMTP path still exists, and building it surfaced a constraint worth writing down: **the sender cannot be a Workspace address** like `@berkeley.edu`. Google ended basic-auth SMTP for Workspace in May 2025, and App Passwords now depend on a per-domain admin setting that universities almost always leave off — so it fails with `535 BadCredentials` no matter how many App Passwords you generate. The credential check rejects a Workspace sender up front rather than letting Gmail return a generic error.

## 5. Known limits

- **LinkedIn, Indeed and Handshake are not covered** — login-gated and scraping-prohibited. Handshake postings still need checking by hand.
- **Google is page 1 only.** Its `robots.txt` disallows paginated career URLs for generic agents, so breadth comes from running multiple queries instead.
- **Several companies are listed as pending and skipped,** each with a note saying why. Uber's board serves only "Job removed" rows to a headless browser; some Workday tenants resolve but their site paths are unknown.
- **Career-site APIs are undocumented and change without notice.** That is what the failure alert exists for — the design assumes breakage rather than hoping against it.
