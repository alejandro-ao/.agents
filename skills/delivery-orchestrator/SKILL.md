---
name: delivery-orchestrator
description: Deliver an already-approved issue through an isolated worktree, verification, independent review, revision, and a draft pull request. Use only after portfolio-level selection or explicit human approval of the issue.
---

# Delivery Orchestrator

Own one approved issue from safe start through a reviewed draft PR. Do not perform
portfolio scoring or backlog prioritization; rely on the supplied approved scope.

## Start gate

Before delegating implementation, confirm the issue is still unclaimed, accepted
scope and criteria are unchanged and testable, repository instructions and checks
are available, and there is no newly discovered conflict or sensitive area. Defer
to a human if this gate fails. Do not silently broaden scope.

## Workflow

1. Create durable run evidence outside the implementation worktree and initialize
   machine-managed JSON state with `scripts/transition-state.mjs`.
2. Launch a fresh implementation specialist using `templates/implement.md`.
3. Verify the branch, candidate commit, draft PR, required checks, and cumulative
   diff independently.
4. Launch a fresh independent reviewer in a fresh detached review worktree using
   `templates/review.md`.
5. For blocking or important findings, launch a fresh revision specialist in the
   existing implementation worktree using `templates/revise.md`, then repeat full
   verification and review. Respect the approved review-cycle limit.
6. Produce the owner report using `templates/final-report.md`.

## Machine-managed run state

Create a collision-resistant run directory outside the implementation worktree:

```text
<run>/
  config.json             immutable approved issue, scope, policy, and checks
  state.json              current validated workflow state
  transitions.jsonl       append-only state-transition audit trail
  assignments.jsonl       specialist launches and terminal outcomes
  prompts/                rendered specialist assignments
  reports/                validated specialist JSON reports
  verification/           commands, exit codes, and concise output
  final-report.md
```

`config.json` is written once after the start gate. Never use an interactive
editor to alter `state.json` or `transitions.jsonl`. Initialize and transition
state only through this skill's state script:

```text
node scripts/transition-state.mjs init --run-dir <run> --run-id <id> --issue <issue> --actor <actor> --next-action <action>
node scripts/transition-state.mjs transition --run-dir <run> --to <state> --actor <actor> --decision <reason> --next-action <action> [--evidence <path-or-url>]
```

The script validates the existing JSON, enforces allowed transitions, atomically
replaces `state.json`, and appends a matching JSON record to
`transitions.jsonl`. Stop and reconcile if either artifact is missing, malformed,
or inconsistent; do not repair state by hand.

## Non-negotiable safeguards

- One issue gets one implementation branch and worktree.
- Implementers never review their own work.
- Every review session and review worktree is fresh and independent.
- Revision reuses the existing implementation worktree and PR branch.
- Validate specialist reports before transitioning state; preserve run evidence.
- Never merge, close an issue, post issue comments, or create non-draft PRs
  without the applicable explicit policy and named human approval.

## Outcome states

`approved → implementing → verifying → reviewing → revising → verifying`

After an approved review: `awaiting_final_approval → completed_unmerged`.
`blocked`, `failed`, and `cancelled` are valid terminal exits from any active
stage. `merged` requires an explicit human approval that names the specific PR.

Terminal outcomes are `completed_unmerged`, `blocked`, `failed`, or `cancelled`.
A PR is ready only after configured verification passes and no blocking or
important independent-review findings remain. It stays unmerged until a human
explicitly approves that specific PR.
