---
name: delivery-orchestrator
description: Deliver one already-approved issue through an isolated worktree, verification, independent review, revision, and a draft pull request.
---

# Delivery Orchestrator

## What this does

This skill owns **one approved issue**. It accepts a validated `handoff.json`
from `portfolio-orchestrator`, creates a draft PR, and stops for human merge
approval. It does not re-rank backlog issues or merge.

```mermaid
flowchart LR
  A["Approved handoff"] --> B["Implementation"]
  B --> C["Verification"]
  C -->|"passes"| D["Independent review"]
  C -->|"fails"| E["Revision"]
  D -->|"findings"| E
  E --> C
  D -->|"approved"| F["Await human approval"]
  F --> G["Completed unmerged"]
```

## Start gate

Before implementation, confirm the issue is still unclaimed, scope and
acceptance criteria are unchanged and testable, instructions and checks are
available, and no newly discovered conflict or sensitive area exists. Otherwise
block for a human decision; never silently broaden scope.

## Runtime delegation

For each implementation, review, or revision specialist subagent, prefer the
environment's built-in subagent/worker tool and launch it in a fresh session.
If it is unavailable but `tau` and `tmux` are available, render the assignment
to `prompts/<assignment>.txt` and launch a fresh non-interactive Tau session in
a uniquely named detached tmux session with `tau --print --new-session
--session-id <id> --cwd <cwd>`. Save stdout and exit status under `processes/`.
If neither runtime is available, block before delegation.

Record each specialist subagent's role, runtime, session ID, prompt path, report
path, start time, and terminal outcome. Poll at bounded intervals, never send
interactive keystrokes, preserve logs on timeout, and stop only the named tmux
session. A missing or invalid report is failure; do not infer success from prose.

## Workflow

1. Initialize the run state and artifacts.
2. Launch a fresh implementation specialist subagent with `templates/implement.md`.
3. Independently verify the result with `templates/verify.md`.
4. Launch a fresh independent review specialist subagent with
   `templates/review.md` in a new detached review worktree.
5. If verification or review finds a material issue, launch a fresh revision
   specialist subagent with `templates/revise.md` in the existing implementation
   worktree, then repeat verification and review.
6. Produce `final-report.md` with `templates/final-report.md`.

## Required artifacts

```text
<run>/
  config.json             approved handoff, scope, policy, and checks
  state.json              current workflow state
  transitions.jsonl       append-only transition history
  assignments.jsonl       specialist subagent launches and outcomes
  prompts/ processes/ reports/ verification/ final-report.md
```

Use `scripts/transition-state.mjs`—never an editor—to initialize or change
`state.json`. The script validates JSON, enforces transitions, atomically writes
the new state, and appends its audit record.

## State transitions

| Event | Transition | Evidence |
|---|---|---|
| Start gate passes | `approved → implementing` | handoff |
| Implementation validates | `implementing → verifying` | implementation report |
| Verification passes | `verifying → reviewing` | verification report |
| Verification/review fails | `verifying/reviewing → revising` | relevant report |
| Revision validates | `revising → verifying` | revision report |
| Review approves | `reviewing → awaiting_final_approval` | review report |
| Human declines merge | `awaiting_final_approval → completed_unmerged` | final report |

`blocked`, `failed`, and `cancelled` are terminal exits from active stages.
`merged` requires explicit approval naming the specific PR.

## Non-negotiable rules

- One issue gets one implementation branch and worktree.
- Implementation and review always use different fresh specialist subagents in
  distinct sessions.
- Every review uses a fresh detached worktree; revisions reuse the implementation
  worktree and PR branch.
- Validate every specialist subagent JSON report and cross-check its branch, worktree,
  commit, and PR before advancing state.
- Never advance from prose alone. Never merge, close issues, publish comments,
  or create a non-draft PR without explicit human authority.
