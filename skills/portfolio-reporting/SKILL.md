---
name: portfolio-reporting
description: Produce a concise daily owner digest from portfolio triage records and delivery-orchestrator run evidence. Use after a scheduled portfolio intake or whenever the user wants a portfolio-level SDLC status report.
---

# Portfolio Reporting

Turn validated portfolio and delivery evidence into one daily owner report. This
skill is read-only: it never selects issues, launches workers, edits code, opens
PRs, posts messages, or merges.

## Inputs

Read only recorded evidence from `portfolio-orchestrator` and
`delivery-orchestrator` runs: accepted policy and brief, triage reports,
selection and handoff records, validated delivery reports, verification results,
independent-review outcomes, and remote PR state.

Do not infer a ready state from conversation output or a worker's prose. If a
report is missing, stale, contradictory, or unvalidated, classify it as needing
reconciliation.

## Daily digest

Lead with decisions and organize the report into these sections:

1. **Ready for explicit merge approval** — draft PRs whose configured checks
   passed and whose independent review has no blocking or important findings.
2. **Low-risk, easy-to-validate PRs** — only when evidence supports low risk,
   narrow scope, passing checks, and clear manual-validation steps. This is a
   label for prioritization, not merge authorization.
3. **Work in progress** — issue, current delivery state, last verified outcome,
   and next stage.
4. **Needs your decision** — the smallest product, scope, risk, or policy
   decision preventing progress.
5. **Deferred at triage** — duplicates, weak fit, insufficient clarity,
   sensitive scope, active conflicts, or below-threshold work, with evidence.
6. **Promising next candidates** — high-scoring unselected low-risk issues,
   ranked by score, user value, lower risk, and lower effort.
7. **Operational exceptions** — timeouts, failures, budget limits, missing
   evidence, stale PR status, and repository conflicts.

Link every item to the relevant issue, delivery run, and PR when those exist.
Use product-owner language; keep raw logs and internal transcripts in artifacts.

## Truth and safety rules

- State that a PR is unmerged unless a named human approval and verified merge
  record exist.
- Never say "ready" when required checks or review evidence are missing.
- Distinguish verified facts from recommendations and unresolved questions.
- Do not recommend merging sensitive work merely because its checks pass.
- Surface original-checkout anomalies without attributing unrelated changes to a
  delivery run.

## Output

Write one timestamped Markdown digest to the portfolio run directory and return
a concise summary. Include the exact next human action only when one is needed.
