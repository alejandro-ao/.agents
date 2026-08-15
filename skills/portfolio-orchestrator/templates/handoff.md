# Delivery handoff contract

Create `handoff.json` only after the portfolio orchestrator validates the triage
report and selects the issue. It is the sole input for `delivery-orchestrator`.

```json
{
  "schema_version": 1,
  "issue": "number-or-url",
  "approved_scope": "bounded scope",
  "acceptance_criteria": ["objective criterion"],
  "project_brief": "absolute artifact path",
  "triage_report": "absolute artifact path",
  "weighted_score": 0.0,
  "risk": "low|medium|high",
  "related_work": ["reference"],
  "required_checks": ["command"],
  "draft_pr_only": true,
  "max_review_fix_cycles": 2,
  "run_directory": "absolute path",
  "locking_context": "active worktrees, PRs, or none"
}
```
