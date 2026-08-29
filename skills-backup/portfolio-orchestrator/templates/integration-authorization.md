# Unattended integration authorization

This optional mode permits one approved umbrella plan to run without pausing for
each child issue or child-PR integration. It never authorizes a merge to the
repository's default branch.

Write the accepted authorization to `<portfolio-run>/integration-authorization.json`:

```json
{
  "schema_version": 1,
  "mode": "unattended_integration",
  "authorized": true,
  "repository": "owner/repository",
  "umbrella_issue": "number-or-url",
  "accepted_plan": "absolute path and content hash",
  "default_branch": "main",
  "integration_branch": "feat/example-integration",
  "allowed_actions": [
    "create_child_issues",
    "dispatch_delivery",
    "create_draft_child_prs",
    "merge_validated_child_prs_to_integration_branch"
  ],
  "forbidden_actions": [
    "merge_to_default_branch",
    "close_umbrella_issue",
    "publish_release",
    "delete_remote_branches"
  ],
  "execution_policy": {
    "max_concurrent_deliveries": 2,
    "max_review_fix_cycles": 2,
    "timeout_per_assignment_minutes": 90,
    "wall_clock_budget_minutes": 360
  },
  "required_checks": ["project-specific command"],
  "stop_conditions": [
    "accepted plan must materially change",
    "target branch differs from integration_branch",
    "security or secret exposure is discovered",
    "destructive migration or external production action is required",
    "required verification cannot pass within retry limits",
    "integration conflict cannot be resolved without changing child scope"
  ],
  "human_instruction": "verbatim or concise quoted authorization",
  "authorized_at": "ISO-8601 UTC"
}
```

## Validation

Before dispatching anything, verify:

- repository and umbrella issue match the accepted brief;
- the accepted plan exists and its hash is recorded;
- `integration_branch` is non-empty and differs from `default_branch`;
- allowed actions contain only the bounded actions above;
- forbidden actions include default-branch merge and release publication;
- limits and required checks are explicit;
- the human authorization covers the complete umbrella plan and automatic child
  integration into the named branch.

The authorization covers only child work traceable to the accepted plan. New
product scope, default-branch delivery, releases, destructive actions, and
unresolved security decisions still require fresh human approval.
