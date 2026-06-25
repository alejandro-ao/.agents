---
description: Implement a feature in a worktree and open a PR to the default branch.
---
Implement the feature below in a **new git worktree**. The feature may be a description or an issue reference (issue ID or URL).

Feature description or GitHub Issue: {{ arguments }}

## Worktree

Create worktrees under:
`~/.agents/worktrees/<repo-name>/<feature-slug>/`

Where:
- `<repo-name>` = basename of the current repository.
- `<feature-slug>` = short kebab-case description (e.g. `add-user-auth`).

Example:
`~/.agents/worktrees/my-app/add-user-auth/`

Rules:
- Never create a worktree inside or adjacent to the repository.
- If the target directory already exists, choose another slug or ask the user.

## Workflow

1. Inspect the repository and determine:
   - current branch
   - remote
   - default branch (`main` unless configured otherwise)
2. Create a new worktree from the latest default branch. Use a branch name matching the slug, prefixed with feat/, fix/, or chore/.
```bash
git worktree add -b <branch> <worktree-path> origin/<default-branch>
```
3. Perform all edits, testing, and commits inside the worktree.
4. Do not modify the original working tree except for read-only inspection (git status, git log, git remote -v, etc.).
5. Run relevant tests, linters, and type checks.
6. Make clear, atomic commits.
7. Push the branch:

git push -u origin <branch>

8. Create a pull request targeting the default branch with gh pr create.

Report

Return:

- worktree path
- branch name
- commit SHA(s)
- test/check results
- PR URL

## Fallback

If gh or remote access is unavailable, stop after pushing the branch and provide:

- branch name
- base branch
- suggested PR title
- suggested PR body