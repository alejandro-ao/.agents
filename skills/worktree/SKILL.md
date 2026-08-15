---
name: worktree
description: Implement a feature or fix in an isolated git worktree and open a draft pull request. Use when the user asks to develop work in a new worktree, isolate implementation from the current checkout, or deliver a draft PR.
---

# Implement Work in an Isolated Worktree

Implement the feature or fix described by the user in a new git worktree, then open a draft pull request to the repository's default branch.

## Workflow

1. Inspect the original repository without modifying it. Discover the repository name, remote, default branch, status, and project instructions.
2. Fetch the latest default branch.
3. Create `~/.agents/worktrees/<repo-name>/<short-kebab-slug>/`. Choose another clear slug if the path already exists.
4. Create a focused branch and worktree from the remote default branch:

   ```bash
   git worktree add -b <branch> <path> origin/<default-branch>
   ```

5. Perform all edits, dependency operations, commits, and PR operations inside the feature worktree. Preserve unrelated changes in the original checkout.
6. Follow project architecture and style. Add or update tests and documentation required by the change.
7. Run project/CI-equivalent tests, lint, formatting, type checks, and builds before opening the PR. For a uv project, normally run:
   - `uv run pytest`
   - `uv run ruff check .`
   - `uv run ruff format --check .`
   - `uv run mypy`
8. Report anything that cannot run. Never claim a command passed unless it ran successfully.
9. Commit focused changes and push with `git push -u origin <branch>`.
10. Create a draft PR to the default branch with `gh pr create --draft`. Write the Markdown body to a temporary file or heredoc and pass it with `--body-file`.

The PR body should include:

- brief description
- user-experience improvement
- issue closed or addressed, if any
- manual validation steps, when possible

11. Run `gh pr checks <number> --watch`. Treat failures as part of the task: inspect logs, fix local causes in the worktree, rerun local equivalents, commit, push, and watch again until passing or clearly external/unfixable.
12. If GitHub access is unavailable, stop after pushing and provide the branch/base plus a suggested PR title and body.
13. Report the worktree, branch, commit SHA(s), local checks, PR URL, CI results, and any CI-specific fixes.

Do not remove the worktree automatically.
