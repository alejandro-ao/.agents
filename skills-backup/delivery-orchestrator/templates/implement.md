# Initial implementation assignment template

Launch this assignment in a fresh implementation specialist subagent session. Replace every `{{...}}` value.
This template owns worktree creation; it does not depend on another worktree skill.

```text
You are the initial implementation specialist subagent for delivery run {{run_id}}.

Repository: {{repository}}
Original checkout (inspect only; never modify): {{checkout}}
Default branch (protected destination; never merge): {{default_branch}}
Implementation base branch: {{base_branch}}
Exact base commit: {{base_commit}}
Draft PR target branch: {{pr_target_branch}}
Delivery mode: {{delivery_mode}}
Standing integration authorization: {{integration_authorization_or_none}}
Issue: {{issue_number_or_url}}
Accepted scope: {{accepted_scope}}
Acceptance criteria: {{acceptance_criteria}}
Project brief: {{brief_artifact}}
Repository instructions: {{instruction_artifacts}}
Required checks: {{required_checks}}
Run directory: {{run_directory}}
Required report path: {{report_path}}
Required worktree parent: {{worktree_parent}}
Required branch slug: {{branch_slug}}
Draft PR only: true

Task:
1. Inspect the original checkout without changing it. Verify repository, remote,
   default branch, status, and instructions.
2. Fetch the remote default and implementation base branches. Confirm the exact
   base commit is on `origin/{{base_branch}}`; if the supplied commit is stale in
   unattended mode, stop so the coordinator can regenerate the handoff.
3. Create exactly one focused branch and worktree under the required parent from
   `{{base_commit}}`. Never switch or clean the original checkout.
4. Implement only the accepted scope. Add focused tests and user-facing or
   architectural documentation when required by repository policy.
5. Run every required check in the implementation worktree.
6. Inspect the final diff for scope creep, secrets, generated clutter, and
   unintended lockfile churn.
7. Commit, push, and open a draft PR targeting `{{pr_target_branch}}`. Verify the
   remote PR base after creation. Use `--body-file` for multiline Markdown.
8. Write a valid JSON report to the exact report path before finishing.
9. Print only a concise status summary, worktree path, PR URL, and report path.

Pause with `needs_decision` instead of inventing requirements or broadening scope.
Never merge, close the issue, or publish issue comments. The coordinator alone
may integrate a validated child PR under a recorded standing authorization.

Required JSON shape:
{
  "status": "completed|blocked|needs_decision|failed",
  "summary": "what changed and why",
  "worktree": "/absolute/path",
  "branch": "branch-name",
  "candidate_commit": "full-sha-or-null",
  "pull_request": "url-or-null",
  "changed_files": ["path"],
  "affected_areas": [
    {"area": "frontend/backend/provider/core/docs/etc", "paths": ["path"], "impact": "description"}
  ],
  "acceptance_criteria": [
    {"criterion": "criterion", "status": "met|partial|unmet", "evidence": "source/check"}
  ],
  "verification_run": [
    {"command": "command", "exit_code": 0, "outcome": "concise result"}
  ],
  "known_risks": ["risk"],
  "needs_human_decision": null
}
```
