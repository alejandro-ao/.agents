---
name: portfolio-orchestrator
description: Run a scheduled portfolio workflow: discover and rank issues, select safe work, dispatch approved issues to delivery-orchestrator, collect validated outcomes, and produce a daily owner digest. Use for daily backlog triage and SDLC orchestration.
---

# Portfolio Orchestrator

Own the portfolio-level decision: **which issues should enter delivery today?**
Do not implement code, review pull requests, or merge. Dispatch selected issues to
`delivery-orchestrator`, which owns each issue's isolated delivery lifecycle.

## Responsibilities

1. Discover candidate issues and existing delivery runs for the target repository.
2. Apply the accepted project brief and selection policy consistently across the backlog.
3. Delegate evidence-based triage in fresh, read-only specialist sessions.
4. Select only issues that pass every hard gate, meet the threshold, and fit the
   concurrency, budget, and repository-conflict limits.
5. Launch one independent `delivery-orchestrator` run per selected issue.
6. Collect validated delivery outcomes and publish the daily owner digest.

## Required setup

Derive repository facts, default branch, instructions, available checks, active
worktrees, open PRs, and active runs. Ask once for any missing material decision:

- repository and issue scope/backlog;
- accepted project brief and non-goals;
- selection policy, including score threshold and maximum concurrent deliveries;
- daily budget and whether automatic dispatch is permitted;
- digest destination and cadence.

The default is conservative: select at most one low-risk issue, create draft PRs
only, and never merge, close issues, relabel issues, or publish issue comments.

## Hard gates

Reject or defer an issue when it is duplicate/actively worked, outside the brief,
unclear or untestable, blocked by a product decision, conflicts with repository
policy, or touches security, authentication, billing, destructive migration,
production infrastructure, privacy, or legal work. Those sensitive categories
always require a human decision.

## Selection

For each eligible candidate, calculate the weighted score mechanically:

`project fit`, `user value`, `clarity`, `confidence`, `risk safety`, and
`effort efficiency`.

Rank by score, then user value, lower risk, and lower effort. Never select work
just to fill capacity. Record the evidence and exact decision for every candidate.

## Dispatch contract

Pass every selected issue to `delivery-orchestrator` with:

- approved issue snapshot, scope, acceptance criteria, and project brief;
- triage evidence, score, risk, and related-work findings;
- required checks, draft-PR-only policy, and review-cycle limit;
- run/artifact location and concurrency/locking context.

The delivery orchestrator may perform only a lightweight start gate: verify that
the issue remains unclaimed, scope is unchanged, criteria are still testable, and
no newly discovered sensitive area or conflict exists. It must not re-score the
backlog or override portfolio selection.

## Handoff outcome

For every selected issue, write a compact, validated handoff record before
dispatching. Include the issue snapshot, approved scope and acceptance criteria,
project brief, evidence-backed score and risk, related work, required checks,
draft-PR-only policy, review-cycle limit, and run/locking context.

For every deferred issue, write the hard-gate reason or the smallest human
decision needed.

## Daily owner digest

After collecting validated delivery-run reports and current PR state, write one
timestamped Markdown digest in the portfolio run directory. Lead with decisions,
use product-owner language, and organize it into:

1. **Ready for explicit merge approval** — draft PRs with passing configured
   checks and no blocking or important independent-review findings.
2. **Low-risk, easy-to-validate PRs** — only when evidence supports narrow
   scope, low risk, passing checks, and clear manual-validation steps.
3. **Work in progress** — issue, last verified result, current stage, and next
   action.
4. **Needs your decision** — the smallest product, scope, risk, or policy
   decision that prevents progress.
5. **Deferred at triage** — the evidence-backed hard-gate reason.
6. **Promising next candidates** — high-scoring, low-risk unselected work.
7. **Operational exceptions** — timeouts, failures, budget limits, missing
   evidence, stale PR state, and repository conflicts.

Link each item to its issue, run, and PR when present. Never infer a ready state
from worker prose. State that a PR remains unmerged unless an explicit human
approval naming that PR and a verified merge record exist.

## Durable evidence

Maintain one run directory outside any implementation worktree containing the
accepted configuration and brief, issue snapshots, triage reports, selection
decisions, dispatch records, delivery summaries, transition log, and daily digest.
Preserve evidence on failure. Do not infer completion from a worker's prose: use
its validated report or recorded terminal state.

## Failure policy

Retry only safe, idempotent discovery. Reconcile repository and remote state
before retrying a dispatch. On ambiguity, conflict, sensitivity, or missing
evidence, defer the issue and state the exact human decision needed.
