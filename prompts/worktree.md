---
description: Implement a feature in a worktree and open a PR to the default branch.
---
Implement this feature in a new git worktree and open a draft PR: {{ arguments }}

- Inspect the current branch, remotes, default branch, and status read-only. Never modify the original working tree or discard unrelated work.
- Fetch the latest default branch. Create `~/.agents/worktrees/<repo-name>/<short-kebab-slug>/` (choose another slug if it exists) on `feat/<slug>`, `fix/<slug>`, or `chore/<slug>`:
  ```bash
  git worktree add -b <branch> <path> origin/<default-branch>
  ```
- Do all edits, dependency work, tests, commits, and PR operations inside the feature worktree. Follow repository instructions and keep commits atomic.
- Run project/CI-equivalent tests, lint, format, type checks, and builds before the PR (for uv projects: `uv run pytest`, `uv run ruff check .`, `uv run ruff format --check .`, `uv run mypy`). Report anything that cannot run.
- Push with `git push -u origin <branch>`, then create a draft PR to the default branch using `gh pr create --draft` and a Markdown body file.
- Run `gh pr checks <number> --watch`. Treat failures as part of the task: inspect logs, fix in the worktree, rerun local equivalents, commit, push, and watch again until passing or clearly external/unfixable.
- If GitHub access is unavailable, stop after pushing and provide branch/base plus a suggested PR title/body.
- If merging from this worktree, remove it or detach it from the merge commit before checking out the default branch elsewhere.
- Report worktree, branch, commit SHA(s), local checks, PR URL, CI results, and any CI-specific fixes (or none).
