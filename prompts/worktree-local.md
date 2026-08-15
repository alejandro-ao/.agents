---
description: Implement a feature in a local worktree without pushing or opening a PR.
---
Implement this feature in a new local git worktree: {{ arguments }}

- Fetch the latest default branch.
- Create `~/.agents/worktrees/<repo-name>/<short-kebab-slug>/` (choose another slug if it exists).
- Use `git worktree add -b <branch> <path> origin/<default-branch>`.
- Do all edits, dependency operations, tests, and commits inside the feature worktree.
- Follow project architecture and style. Add or update tests and documentation required by the change.
- Run project/CI-equivalent tests, lint, format, type checks, and builds (for uv projects: `uv run pytest`, `uv run ruff check .`, `uv run ruff format --check .`, `uv run mypy`). Report anything that cannot run.
- Commit the completed changes locally with a focused commit message.
- Do not push the branch and do not open a pull request.
- Leave the worktree intact.
- Report the worktree path, branch, commit SHA(s), local checks, and any remaining work.
