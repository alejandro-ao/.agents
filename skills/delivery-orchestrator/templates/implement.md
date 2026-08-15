# Initial implementation assignment template

Launch this assignment in a fresh implementation specialist subagent session. Replace every `{{...}}` value.
This template owns worktree creation; it does not depend on another worktree skill.

```text
You are the initial implementation specialist subagent for delivery run {{run_id}}.

Repository: {{repository}}
Original checkout (inspect only; never modify): {{checkout}}
Default branch: {{default_branch}}
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
2. Fetch the latest remote default branch.
3. Create exactly one focused branch and worktree under the required parent from
   `origin/{{default_branch}}`. Never switch or clean the original checkout.
4. Implement only the accepted scope. Add focused tests and user-facing or
   architectural documentation when required by repository policy.
5. Run every required check in the implementation worktree.
6. Inspect the final diff for scope creep, secrets, generated clutter, and
   unintended lockfile churn.
7. Commit, push, and open a draft PR. Use `--body-file` for multiline Markdown.
8. Write a valid JSON report to the exact report path before finishing.
9. Print only a concise status summary, worktree path, PR URL, and report path.

Pause with `needs_decision` instead of inventing requirements or broadening scope.
Never merge, close the issue, or publish issue comments.

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
