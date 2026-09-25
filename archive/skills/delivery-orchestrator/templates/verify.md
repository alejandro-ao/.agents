# Verification assignment

The delivery orchestrator performs this step independently; do not delegate it to
the implementation specialist subagent. Save one JSON report at `{{report_path}}`.

```text
Inputs: implementation report {{implementation_report}}, approved handoff
{{handoff}}, candidate commit {{candidate_commit}}, draft PR {{pull_request}},
required checks {{required_checks}}, expected PR target {{pr_target_branch}},
base commit {{base_commit}}, and delivery mode {{delivery_mode}}.

Confirm the branch and PR match the implementation report. Confirm the remote PR
base is exactly the expected target and the candidate descends from the recorded
base commit. Confirm the candidate
commit exists on that branch. Run every required check in the implementation
worktree. Inspect the cumulative diff for scope creep, secrets, generated
clutter, unintended lockfile changes, missing tests/docs, and brief conflicts.
Record current remote-check status without claiming unrun checks passed.

{
  "status": "passed|failed|blocked",
  "candidate_commit": "full-sha",
  "pull_request": "url",
  "pr_target_branch": "verified-base-branch",
  "base_commit": "verified-full-sha",
  "checks": [{"command": "command", "exit_code": 0, "outcome": "concise result"}],
  "diff_verdict": "pass|fail",
  "findings": ["specific concern"],
  "next_action": "review|revise|needs_decision"
}
```
