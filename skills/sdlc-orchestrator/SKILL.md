---
name: sdlc-orchestrator
description: Coordinate issue triage, isolated implementation, verification, independent review, revision, and human-approved delivery using fresh specialist agents and durable run evidence.
---

# SDLC Orchestrator

Coordinate a safe issue-to-PR workflow. The orchestrator owns policy, state,
verification, and handoffs. Fresh specialists perform triage, implementation,
revision, and review. **Every merge requires explicit human approval naming the
specific PR.**

## Operating principles

1. Project intent outranks issue wording.
2. Selection uses documented evidence and mechanical scoring.
3. One issue gets one implementation branch and worktree. Each specialist round
   gets a fresh agent session.
4. The implementation agent never reviews its own work.
5. Verification, diff inspection, and independent review control transitions.
6. Never merge, close issues, publish issue comments, or broaden scope without
   the applicable policy or human approval.
7. Enforce concurrency, timeout, risk, and review-cycle limits.
8. Persist exact assignments, evidence, decisions, and terminal outcomes.
9. Report in product-owner language; retain technical evidence in artifacts.

## Bundled assignment resources

Read the relevant file completely before rendering an assignment:

- Triage: `templates/triage.md`
- Initial implementation and worktree creation: `templates/implement.md`
- Revision in the existing implementation worktree: `templates/revise.md`
- Independent review and re-review: `templates/review.md`
- Product-owner report: `templates/final-report.md`

Resolve these paths relative to this `SKILL.md`. These templates are the complete
specialist instructions; do not invoke external `worktree` or `review` skills.
This avoids conflicting worktree rules and keeps the workflow versioned together.

## 1. Establish configuration

### A persistent SDLC configuration file is optional

A user-authored `.agents/sdlc.yaml` is not required. Persistent profiles are
useful only for repeated unattended runs because they avoid asking the same
policy questions and prevent policy drift across operators. The authoritative
configuration for every execution is instead a generated, immutable
`config.json` inside that run's artifact directory.

The run snapshot is required because it records what the agents actually used:
target repository and issue scope, accepted project brief, scoring weights,
automation limits, required checks, and human answers. This makes a run
reproducible without forcing the product owner to maintain YAML.

If an optional profile exists at `<checkout>/.agents/sdlc.yaml` or
`~/.agents/sdlc/<owner>-<repository>.yaml`, load it as questionnaire defaults,
not as permission to merge. Record its absolute path and hash in `config.json`.

### Derive safe facts

Derive and show, rather than ask for:

- repository owner/name, checkout, remote, and default branch;
- repository instructions and likely project-brief documents;
- available test/lint/type/documentation commands from project guidance and CI;
- `tau`/tmux availability and skill/template paths;
- issue or PR named in the invocation;
- current conflicting branches, worktrees, runs, issues, and PRs.

Never derive product intent, acceptance of a synthesized brief, risk overrides,
or permission to merge.

### One bundled questionnaire

When the invocation or optional profile does not answer the following, ask once
at the start and wait. Keep the question concise and pre-fill discovered values:

```markdown
## SDLC run setup
1. **Work scope:** Which issue(s) should this run assess? I found: <items>.
2. **Project brief:** Use `<detected brief>`, or approve this synthesized brief?
   - Purpose/users: <summary>
   - Priorities/non-goals: <summary>
   - Architecture/sensitive areas: <summary>
   - Testing expectations: <summary>
3. **Automation policy:** Use the standard safe policy below, or customize it?
4. **Verification:** I discovered `<commands>`. Any required additions?
5. **Delivery:** Draft PR only and stop for explicit merge approval. Confirm?
```

The user may answer “use discovered values and standard safe policy.” Ask a
follow-up only for a material ambiguity. If the brief is missing and the user
does not approve a synthesized one, mark the run `blocked`. Never silently
invent required configuration.

### Standard safe policy

Use these values only when accepted by the user or an optional profile:

```json
{
  "selection_policy": {
    "acceptance_threshold": 75,
    "max_selected_issues": 1,
    "excluded_labels": ["wontfix", "security", "needs-design"],
    "max_risk_for_automation": "low",
    "weights": {
      "project_fit": 30,
      "user_value": 20,
      "clarity": 15,
      "confidence": 15,
      "risk_safety": 10,
      "effort_efficiency": 10
    }
  },
  "execution_policy": {
    "max_concurrent_issues": 1,
    "max_review_fix_cycles": 2,
    "timeout_per_assignment_minutes": 90,
    "draft_pr_only": true
  }
}
```

Weights must total 100. Security, authentication, billing, destructive data
migration, production infrastructure, and legal/privacy work always require a
human decision regardless of score.

## 2. Initialize durable run artifacts

Create a collision-resistant run ID and an absolute run directory outside the
implementation worktree, for example `~/.agents/runs/<run-id>/`.

Use this layout:

```text
<run>/
  config.json                 immutable accepted configuration
  brief.md                    accepted project brief
  state.json                  current state and next action
  transitions.jsonl           append-only timestamped transitions
  assignments.jsonl           append-only launches and outcomes
  prompts/                    fully rendered specialist prompts
  reports/                    validated specialist JSON reports
  processes/                  wrapper, stdout, exit status, timeout evidence
  verification/               commands, exit codes, concise output
  final-report.md
```

Every transition record must contain:

```json
{
  "timestamp": "ISO-8601 UTC",
  "issue": "number-or-url",
  "from": "previous-state",
  "to": "new-state",
  "actor": "orchestrator-or-exact-session-id",
  "evidence": ["absolute artifact path or remote URL"],
  "decision": "concise reason",
  "next_action": "one action"
}
```

Append the transition and update `state.json` immediately. Do not reconstruct
state only at the end.

## 3. Preflight gate

Before launching triage, verify and record:

- accepted configuration and brief exist and use absolute artifact paths;
- repository/default branch/remotes match configuration;
- weights total 100 and limits are valid;
- bundled templates resolve from this skill directory;
- required commands and `tau` are available;
- a native delegation tool is available, or both `tmux` and `tau` are available;
- no conflicting active run, implementation branch/worktree, or PR exists;
- run directory, timeout, concurrency, and session namespace are valid;
- original checkout status is captured so concurrent unrelated changes can be
  detected without modifying or attributing them to this run.

Block on failure. Do not start a partial workflow.

## 4. States

```text
discovered → enriched → scored
→ selected | below_threshold | excluded | duplicate
→ implementing → verifying → reviewing
→ revising → verifying → reviewing
→ awaiting_final_approval
→ merged | completed_unmerged | blocked | failed | cancelled
```

## 5. Specialist delegation

The orchestrator must not perform specialist work itself.

For triage, initial implementation, every revision, initial review, and every
re-review:

1. Render the matching bundled template with all placeholders resolved.
2. Include repository, issue/PR, accepted scope, brief, criteria, constraints,
   checks, exact candidate commit when applicable, report path, and run path.
3. Launch a fresh agent context.
4. Record role, ordinal, exact session/child ID, runtime, prompt path, candidate
   commit, start time, and eventual outcome in `assignments.jsonl`.
5. Validate the specialist's JSON report before changing state.

Never reuse an implementation session as a reviewer. Revisions use fresh agent
sessions but the same implementation worktree/branch. Reviews use fresh detached
review worktrees and never reuse an implementation or prior review worktree.

### Why reports are separate JSON artifacts

Stdout is process logging, not a reliable API: Markdown fences may be malformed,
output may be truncated, and status prose can be confused with evidence. Each
specialist therefore writes one JSON report to a predetermined path under
`reports/`. The orchestrator parses that file, validates required fields and
enums, cross-checks commit/worktree/PR values, and advances only from validated
data. Preserve stdout for diagnosis, but do not scrape YAML or JSON from it.

If the report is missing or invalid, do not infer success from prose. Diagnose
stdout/session evidence, then mark the assignment failed or safely retry a
pre-agent launch failure.

### Runtime order

1. Prefer a native subagent/delegation tool when available.
2. Otherwise use a fresh Tau print-mode session in a uniquely named detached
   tmux session.
3. If neither is available, mark the run `blocked`.

For native delegation, record tool-call ID, child/session ID, runtime, prompt,
and report. Consume the report by default; inspect a full child transcript only
when the report fails validation, evidence conflicts, or the human requests it.

### Required Tau/tmux launch protocol

Generate the session ID in the orchestrator. Use only letters, numbers, `.`, `_`,
and `-`, maximum 128 bytes. Use both `--new-session` and `--session-id`:

```bash
#!/usr/bin/env bash
set +e
TAU_NO_UPDATE_CHECK=1 tau --print --new-session \
  --session-id "$SPECIALIST_SESSION_ID" \
  --cwd "$SPECIALIST_CWD" \
  "$(cat "$PROMPT_FILE")" >"$OUTPUT_FILE" 2>&1
code=$?
printf '%s\n' "$code" >"$STATUS_FILE"
exit "$code"
```

Launch with a collision-resistant tmux name:

```bash
tmux new-session -d -s "$TMUX_SESSION" "bash '$WRAPPER_FILE'"
```

Immediately verify that the exact session JSONL exists, the matching index entry
exists and parses, and its ID/CWD match the assignment. Serialize initialization
for sessions sharing an index namespace. A malformed/missing index is a startup
failure; do not launch another worker into that namespace until reconciled.

Poll at bounded intervals. Do not send keystrokes or treat partial output as
completion. On timeout, capture the pane, terminate only that named tmux session,
preserve artifacts, and mark failed/blocked. Never use `tmux kill-server`.
A missing tmux session without a status file is a launch or specialist failure.

A failure before the first agent turn is a launch attempt, not a specialist
round. Record safe retries separately.

## 6. Triage and selection

Render `templates/triage.md` and delegate triage in a fresh session.

Calculate independently and confirm:

```text
weighted_score = Σ(factor_score × factor_weight) / 100
```

Factors mean:

- project fit: purpose, priority, architecture, and non-goal alignment;
- user value: expected user impact and breadth;
- clarity: complete, objective, testable criteria;
- confidence: evidence that problem and solution area are understood;
- risk safety: reversibility and low operational/security risk;
- effort efficiency: value relative to implementation/maintenance cost.

Hard-gate an issue when excluded by policy, excessive risk, duplicate/active
work, misalignment, unresolved product/design decisions, sensitive scope,
untestable criteria, or repository-policy conflict.

Select automatically only when the user-approved policy permits it, the hard
gate passes, and the score meets the threshold. Rank eligible work by score,
then user value, lower risk, and lower effort. Never manipulate scores to fill
capacity. Do not close, relabel, or comment on unselected issues.

## 7. Initial implementation

Render `templates/implement.md` and launch a fresh implementation agent. It
creates exactly one branch/worktree from the remote default branch, implements
the bounded scope, runs checks, commits, pushes, and opens a draft PR.

Pause on ambiguity rather than broadening scope. The orchestrator must not make
implementation edits.

## 8. Verification

In the implementation worktree, the orchestrator must:

- confirm branch, candidate commit, and draft PR match the report;
- run all configured checks and record command, exit code, and concise output;
- inspect the cumulative diff for scope creep, secrets, generated clutter,
  lockfile churn, missing tests/docs, and project-brief conflicts;
- inspect required remote status checks without claiming unrun checks passed;
- summarize touched product and architecture areas for the final report.

A failure moves to `revising`; render `templates/revise.md` and delegate fixes to
a fresh revision agent in the existing implementation worktree.

## 9. Independent review and revision loop

After verification passes, prove independence in the run record:

- reviewer session ID differs from every implementation/revision ID;
- review worktree differs from implementation and previous review worktrees;
- reviewer starts after the exact candidate commit exists;
- implementer conversation is not reused.

Render `templates/review.md` and delegate review. Review overall score is the
arithmetic mean of its six dimension scores. A score communicates quality but
does not override findings: any blocking or important finding requires revision.

For findings:

1. Render `templates/revise.md`; launch a fresh revision agent in the existing
   implementation worktree.
2. Run full verification again.
3. Render `templates/review.md`; launch a fresh independent re-review agent in a
   fresh detached review worktree.
4. Stop and mark `blocked` after `max_review_fix_cycles`.

Suggestions may remain only when explicitly documented as non-blocking.

## 10. Mandatory human merge approval

When verification passes and no blocking/important findings remain, set
`awaiting_final_approval`. Keep the PR draft unless policy explicitly permits
marking it ready; never merge without explicit human approval naming that PR.
Approval of the run, issue selection, another PR, or general automation is not
merge approval.

Requested changes return through revision, full verification, and fresh review,
then require fresh approval. If the user does not approve merge, leave the PR
open and use `awaiting_final_approval` or `completed_unmerged`.

## 11. Final compliance audit

Before producing the final report, mechanically verify:

- every assignment has an exact ID, prompt, start time, outcome, and report;
- all required JSON reports parsed and cross-check against Git/PR state;
- implementation/revision and review IDs are distinct;
- every review used a fresh worktree and exact candidate commit;
- all transitions have timestamps, actors, evidence, and next actions;
- configured checks and required status checks have recorded outcomes;
- review scores were calculated correctly and findings are resolved/classified;
- implementation worktree, branch, commit, and PR are still available;
- original-checkout anomalies are reported but not falsely attributed;
- PR remains unmerged without explicit approval naming it;
- launch failures, retries, timeouts, and human overrides are disclosed.

A failed audit prevents a “ready” verdict; report the run as blocked or needing
reconciliation.

## 12. Product-owner report

Render `templates/final-report.md`, save it as `final-report.md`, and return it to
the user. Keep it concise and easy to scan. It must include:

- user-visible result and final verdict first;
- application/architecture areas touched and important areas not touched;
- issue and PR links;
- exact implementation worktree path and short manual-validation guidance;
- branch and candidate commit;
- one-line summary of what each agent did, with exact session IDs;
- selection score and every review round's dimension/overall scores;
- verification/CI outcome, resolved findings, remaining risks, and gaps;
- exact next human action and merge-approval status;
- collapsed operational details, including run artifacts and round counts.

Do not expose raw transcripts or overwhelm the product owner with orchestration
mechanics. Keep detailed evidence in the run directory.

## Failure policy

Retry only idempotent reads and safe writes. Reconcile remote state before
retrying GitHub writes. Preserve worktrees and artifacts on timeout or failure.
Pause on conflicts, sensitivity, ambiguity, or newly discovered active work.

Record every human override with timestamp, actor, exact instruction, affected
policy/stage, and resulting risk. An override never counts as merge approval
unless it explicitly names and approves the specific PR.
