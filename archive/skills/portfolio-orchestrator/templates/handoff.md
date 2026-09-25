# Delivery handoff contract

Create `handoff.json` only after the portfolio orchestrator validates the triage
report and selects the issue. It is the sole input for `delivery-orchestrator`.

Normal delivery may use schema version 1. Unattended integration uses version 2
and includes the exact base/target and standing-authorization evidence below.

```json
{
  "schema_version": 2,
  "issue": "number-or-url",
  "approved_scope": "bounded scope",
  "acceptance_criteria": ["objective criterion"],
  "project_brief": "absolute artifact path",
  "triage_report": "absolute artifact path",
  "owner_assessment": "absolute artifact path",
  "weighted_score": 0.0,
  "risk": "low|medium|high",
  "related_work": ["reference"],
  "required_checks": ["command"],
  "draft_pr_only": true,
  "delivery_mode": "manual|unattended_integration",
  "default_branch": "main",
  "base_branch": "main-or-named-integration-branch",
  "base_commit": "full-sha",
  "pr_target_branch": "main-or-named-integration-branch",
  "integration_authorization": "absolute artifact path or null",
  "accepted_plan_section": "heading/id or null",
  "max_review_fix_cycles": 2,
  "run_directory": "absolute path",
  "locking_context": "active worktrees, PRs, or none"
}
```
