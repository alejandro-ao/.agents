---
description: Review a pull request in an isolated git worktree
---
Review this pull request in an isolated worktree: $ARGUMENTS

- Inspect the original repository read-only: status, root, remotes, current/default branches. Never switch branches, modify files, install dependencies, or run destructive commands there.
- Resolve the PR with `gh pr view`; record number, title, author, base/head branches, description, and changed files.
- Use `~/.agents/worktrees/<repo-name>/review-pr-<number>/` (unique suffix if occupied incorrectly). Fetch base and PR refs, then create a detached worktree:
  ```bash
  git fetch origin <base> pull/<number>/head
  git worktree add --detach <path> FETCH_HEAD
  ```
  Use the discovered equivalent ref for forks/non-GitHub remotes.
- Perform all checkout, diff inspection, temporary work, and validation inside that worktree. Do not change code unless explicitly asked.
- Review against the PR base for correctness, regressions, edge cases, error handling, security/data loss, performance, compatibility/migrations, tests, docs, complexity, and style.

## Report

Provide:

- Verdict: approve, comments, or request changes
- Link to the PR
- Short summary of what the PR solves or implements and how it does it.
- Worktree path
- PR metadata
- Concise risk summary
- Prioritized findings with file/line, impact, and concrete fix
- Validation commands/results
- A concise, PR-specific manual validation procedure, including setup, actions, and expected results
- assumptions and limitations
- Cleanup command: `git worktree remove <path>`

Do not remove the worktree automatically. If there are no findings, say so explicitly and mention residual testing gaps.