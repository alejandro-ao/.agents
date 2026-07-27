---
name: sdlc-orchestrator
description: Coordinate automated issue scoring, isolated implementation, verification, independent review, and human-approved merge across GitHub issues, worktrees, coding agents, and pull requests.
---

# SDLC Orchestrator

Coordinate a safe issue-to-PR workflow. The orchestrator manages state, policy,
and evidence; specialists perform bounded triage, implementation, and review.
Issue selection may be automated. **Every merge requires explicit human approval
for that specific PR.**

## Principles

1. Project intent outranks issue wording. Assess issues against the project
   brief, source, current priorities, architecture, and recent changes.
2. Select work with a documented, reproducible score—not intuition alone.
3. One issue gets one branch, worktree, worker, and mutable run record.
4. Tests, checks, diff inspection, and independent review control transitions.
5. Never merge, close issues, or publish issue comments without explicit policy;
   never merge without specific human approval.
6. Enforce limits for concurrency, time, cost, and review-fix cycles.
7. Record decisions, evidence, artifacts, PRs, and terminal outcomes.

## Required configuration

Do not guess missing required values. Report the run as blocked.

```yaml
project:
  repository: owner/repository
  default_branch: main
  local_checkout: /absolute/path/to/checkout
  brief: /absolute/path/to/project-brief.md

selection_policy:
  acceptance_threshold: 75
  max_selected_issues: 1
  excluded_labels: ["wontfix", "security", "needs-design"]
  max_risk_for_automation: low
  weights:                         # must total 100
    project_fit: 30
    user_value: 20
    clarity: 15
    confidence: 15
    risk_safety: 10
    effort_efficiency: 10

execution_policy:
  runtime: project_default
  reviewer_runtime: independent
  max_concurrent_issues: 1
  max_review_fix_cycles: 2
  timeout_per_issue_minutes: 90
  draft_pr_only: true

verification:
  required_commands: []
  required_status_checks: []
```

The project brief must describe purpose, users, priorities, non-goals,
architecture, testing expectations, and sensitive areas.

## States

```text
discovered → enriched → scored
→ selected | below_threshold | excluded | duplicate
→ implementing → verifying → reviewing
→ revising (loops to implementing)
→ awaiting_final_approval
→ merged | completed_unmerged | blocked | failed | cancelled
```

Record timestamp, actor, score/evidence, and next action for each transition.

## Specialist delegation (mandatory)

The orchestrator coordinates specialists; it must not impersonate them. In
particular, the agent that implements a change must never review its own work.
A separate worktree alone is filesystem isolation, not an independent agent
context.

Use this runtime order for every implementation and review assignment:

1. If the active tool set includes a native subagent/delegation tool, use it to
   launch a fresh agent context. Give implementation agents the `worktree` skill
   and review agents the `review` skill.
2. Otherwise, if both `tmux` and `tau` are available, launch a fresh Tau print-mode
   session in a uniquely named detached tmux session.
3. If neither method is available, mark the run `blocked`. Do not perform the
   specialist's work in the orchestrator context and do not describe a detached
   worktree as an independent review.

Each specialist prompt must be self-contained: identify the repository, issue or
PR, accepted scope, project brief, acceptance criteria, constraints, required
checks, output schema, and run-artifact path. Explicitly invoke the relevant
skill, for example:

```text
/skill:worktree Implement issue #123 from this bounded brief: ...
```

```text
/skill:review Review PR #456 against issue #123 and this bounded brief: ...
```

For native delegation, record the tool call ID, child/session ID when available,
runtime, prompt artifact, and final report. Do not reuse an implementation child
as a reviewer.

### Tmux fallback

Use artifact files rather than relying only on tmux scrollback. Create a prompt
file and a wrapper under the run directory; the wrapper starts a new Tau session,
writes its transcript and exit status, and then exits. A representative wrapper
is:

```bash
#!/usr/bin/env bash
set +e
TAU_NO_UPDATE_CHECK=1 tau --print --new-session --cwd "$SPECIALIST_CWD" \
  "$(cat "$PROMPT_FILE")" >"$TRANSCRIPT_FILE" 2>&1
code=$?
printf '%s\n' "$code" >"$STATUS_FILE"
exit "$code"
```

Launch it with a collision-resistant name such as
`tau-<run-id>-implement-<n>` or `tau-<run-id>-review-<n>`:

```bash
tmux new-session -d -s "$TMUX_SESSION" "bash '$WRAPPER_FILE'"
```

Poll at a bounded interval until the status file appears or the configured
issue timeout expires. While it runs, use `tmux has-session` and optionally
`tmux capture-pane -p -t "$TMUX_SESSION"` for progress; do not send keystrokes
or treat partial output as completion. On completion, read the transcript and
status file, validate the requested report, and record the Tau session ID if it
can be recovered. A missing tmux session without a status file is a specialist
failure. On timeout, capture the final pane, terminate only that named tmux
session, preserve all artifacts, and mark the assignment `failed` or `blocked`.
Never use `tmux kill-server`.

Before review, prove independence in the run record: distinct agent/session ID,
distinct tmux session when using the fallback, reviewer start after the candidate
commit/PR exists, and no reuse of the implementer's conversation. If this evidence
is absent, the review is not independent and cannot advance the run.

## 1. Establish the run

Create a run ID and configuration snapshot. Verify the repository and default
branch. Reconcile active runs, issues, and PRs so repeated scheduler or webhook
events cannot duplicate work. Apply runtime and concurrency limits.

## 2. Enrich and score issues

Give a triage specialist the project brief, issue, relevant code/docs, related
work, and recent changes. It must return:

```yaml
issue: <number-or-url>
summary: <plain-language request>
classification: bug | feature | enhancement | question | duplicate | other
affected_areas: [<paths-or-components>]
project_fit: aligned | uncertain | misaligned
ambiguities: [<missing requirements or decisions>]
related_work: [<issues, PRs, docs, or source areas>]
risk: low | medium | high
hard_gate: pass | fail
hard_gate_reasons: [<reasons>]
scores:                         # each 0-100
  project_fit: <score>
  user_value: <score>
  clarity: <score>
  confidence: <score>
  risk_safety: <score>
  effort_efficiency: <score>
weighted_score: <0-100>
score_evidence: [<specific facts supporting scores>]
recommended_next_step: <one sentence>
```

Calculate the weighted score mechanically:

```text
weighted_score = Σ(factor_score × factor_weight) / 100
```

Score consistently:

- **Project fit:** alignment with the brief, priorities, and architecture.
- **User value:** expected impact and breadth of benefit.
- **Clarity:** completeness and testability of acceptance criteria.
- **Confidence:** evidence that the problem and solution area are understood.
- **Risk safety:** reversibility and low operational/security risk; higher is safer.
- **Effort efficiency:** value relative to implementation and maintenance cost.

### Hard gates

Exclude an issue regardless of score when it:

- has an excluded label or exceeds `max_risk_for_automation`;
- is duplicate, misaligned, or already has an active workflow;
- requires unresolved product/design decisions or materially ambiguous scope;
- affects security, authentication, billing, data migration, production
  infrastructure, legal/privacy controls, or destructive operations;
- cannot be tested with objective acceptance criteria;
- conflicts with repository policy or the project brief.

### Automatic selection

An issue is `selected` without human scope approval only when its hard gate
passes and `weighted_score >= acceptance_threshold`. Rank eligible issues by
score, then user value, lower risk, and lower effort. Select up to
`max_selected_issues`.

Preserve the score breakdown and evidence in the run report. Do not manipulate
scores to fill capacity. Mark other issues `below_threshold`, `excluded`, or
`duplicate`; do not close, relabel, or comment on them automatically.

## 3. Implement in isolation

For each selected issue, delegate to a fresh implementation agent according to
**Specialist delegation**. The prompt must invoke the `worktree` skill, which
creates exactly one approved worktree and branch and opens the draft PR. Give it
a self-contained brief containing accepted scope, objective acceptance criteria,
project constraints, paths, required checks, and prohibitions on unrelated
refactors or destructive actions. The orchestrator may verify and inspect the
result, but must not make the implementation edits itself.

Require this report:

```yaml
status: completed | blocked | needs_decision | failed
summary: <what changed and why>
changed_files: [<paths>]
acceptance_criteria:
  - criterion: <criterion>
    status: met | partial | unmet
    evidence: <check, source location, or explanation>
verification_run: [<commands and outcomes>]
known_risks: [<risks>]
needs_human_decision: <null or question>
```

Pause rather than broadening scope when blocked or when a decision is needed.

## 4. Verify

Run configured checks in the issue worktree and capture commands, exit codes,
and concise output. Inspect the diff for scope creep, secrets, generated clutter,
lockfile churn, missing tests, and conflicts with the project brief.

Failed verification returns to the implementer as `revising`. Once verification
passes, create or update a draft PR containing scope, score, implementation
summary, check results, and known risks. Never claim an unrun check passed.

## 5. Review independently

Delegate to a fresh reviewer agent according to **Specialist delegation** and
explicitly invoke the `review` skill. Give it the issue, accepted scope, project
brief, PR, candidate commit, diff, tests, and verification evidence. The reviewer
must not share the implementer's agent/session context. The orchestrator must not
supply its own review verdict. Require:

```yaml
verdict: approved | findings | blocked
findings:
  - severity: blocking | important | suggestion
    location: <file-and-line-or-component>
    problem: <observed concern>
    rationale: <why it matters>
    requested_resolution: <testable action>
remaining_risks: [<risks>]
```

Blocking and important findings return to implementation, followed by full
verification and another independent review. Stop and mark `blocked` after
`max_review_fix_cycles`; never retry indefinitely.

## 6. Mandatory human merge approval

For work with passing verification and no unresolved blocking or important
findings, set `awaiting_final_approval` and present:

```markdown
## <Issue title>
- Selection: <weighted score>/<threshold>; hard gates passed
- Scope: <accepted scope>
- Result: <implementation summary>
- Changed areas: <files/components>
- Verification: <commands and outcomes>
- Review: <verdict and unresolved suggestions>
- Risks/follow-up: <items or none>
- Pull request: <link>
- Recommended decision: approve merge | request changes | defer
```

**Never merge without explicit human approval naming that PR.** Approval of the
run, issue selection, another PR, or a general automation policy is insufficient.
If approval is absent, leave the draft PR open and mark `completed_unmerged` or
`awaiting_final_approval`. Route requested changes through implementation,
verification, and review again before requesting fresh merge approval.

## Failure and reporting

Retry only idempotent reads and safe writes. Preserve worktrees and artifacts on
timeout or runtime failure. Reconcile remote state before retrying GitHub writes.
Pause on repository conflicts or newly discovered ambiguity/sensitivity.

Final reports must group work into selected/in progress, awaiting human merge
approval, below threshold, excluded, blocked, and failed. State what completed,
what evidence supports it, what needs a decision, and what happens next. Do not
include raw agent transcripts unless requested.
