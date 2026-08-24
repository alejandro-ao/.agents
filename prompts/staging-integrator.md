---
description: Review, repair, and merge completed feature work into staging for integration testing
---
Integrate completed feature work into a non-default `staging` branch: $ARGUMENTS

Treat this invocation as authorization to review and repair the confirmed candidates, create or retarget their PRs to `staging`, and merge validated exact heads into `staging`. It never authorizes merging `staging` into the repository's default branch.

## Workflow

1. Read repository instructions. Inspect the repository, remotes, default branch, worktrees, open PRs, CI, and active agent runs without modifying the default-branch checkout.
2. Resolve the arguments to an exact candidate list of PRs, branches, or worktrees. If the arguments do not name candidates, discover likely completed feature work and ask once for confirmation before changing remote state.
3. Derive required checks from repository instructions and CI. Create a collision-resistant run directory under `~/.agents/runs/staging-integrator-<timestamp>/` containing `config.json`, `events.jsonl`, `reports/`, `processes/`, and `final-report.md`.
4. Create `staging` from the current remote default branch if absent. Create an isolated staging worktree under the run directory. Never switch, clean, reset, stash, or otherwise modify the user's default-branch checkout.
5. Ensure each confirmed candidate is committed and pushed. Create a draft PR targeting `staging` when absent, or retarget its existing open PR to `staging`. Stop and ask before including unrelated or ambiguous changes.
6. For every candidate, launch a fresh independent reviewer in a detached worktree at the exact remote candidate commit. Run all required checks and review the complete diff against current `staging` for correctness, regressions, security, architecture, scope, tests, and documentation.
7. For blocking or important findings, have the coordinator launch a fresh fixer in the candidate's feature worktree. The fixer may make only focused fixes, run checks, commit, and push normally. Then launch a fresh detached reviewer for the new exact commit. Do not let a fixer approve its own work. Allow at most 2 repair rounds per candidate; ask before extending the budget.
8. Keep the user updated while reviewers, fixers, CI, or long checks run. Poll at bounded intervals. Prefer native subagents; otherwise use fresh non-interactive Tau sessions in uniquely named detached tmux sessions. Capture logs and exit status. A missing report or vanished process is failure, never PASS.
9. Do not begin integration until every candidate has a valid PASS on its current exact head and required local/remote checks are green.
10. Merge candidates serially into `staging` using GitHub and exact-head protection. Mark a validated draft ready only immediately before merging it. Never force-push, delete branches, bypass protection, or use admin override.
11. Before each merge, verify the PR still targets `staging`, its head is unchanged, checks are green, and it is cleanly mergeable. If `staging` advancement requires updating the candidate, merge current `staging` into its feature branch without rebasing or force-pushing, rerun checks, and obtain a fresh independent review of the changed commit.
12. After every merge, fast-forward the isolated staging worktree and run cumulative required checks. Stop on failure; do not merge later candidates until repaired and revalidated.
13. Never merge, push, or open a PR from `staging` to the default branch. Leave `staging` available for manual testing.

## Final report

Report:

- confirmed candidates and merge order;
- reviewer findings and focused fixes;
- PRs, validated heads, and staging merge commits;
- local, CI, and cumulative check results;
- unresolved risks or manual testing gaps;
- final `staging` commit and staging worktree path;
- explicit confirmation that the default branch and its checkout were untouched.

Write the same result to `final-report.md` in the run directory.
