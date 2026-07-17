---
description: Review a pull request in an isolated git worktree
---
Review this pull request in an isolated worktree: {{ arguments }}

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
- Run reasonable targeted project-native tests, lint, type checks, or builds; avoid destructive or unusually expensive commands. Record exact commands/results and state limitations.
- Report: worktree; PR metadata; verdict (approve / comments / request changes); concise risk summary; prioritized findings with file/line, impact, and concrete fix; validation; assumptions; and `git worktree remove <path>` cleanup command.
- Do not remove the worktree automatically. Keep the report concise and focus on merge-relevant issues.
