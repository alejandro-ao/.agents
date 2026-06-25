---
description: Implement a feature in a separate git worktree, then open a PR to main.
---

You must implement this feature in a separate git worktree, not in the current working tree.

Feature request:
{{ feature }}

Required workflow:

1. Inspect the current repository state and identify the current branch.
2. Create a new git worktree from the latest `main`.
3. Do all implementation, editing, testing, and commits inside that worktree.
4. Do not modify the original working tree except for safe inspection commands.
5. Run the relevant tests and checks before committing.
6. Commit the changes with a clear message.
7. Push the feature branch to the remote.
8. Create a pull request targeting `main`.
9. Report the worktree path, branch name, commit SHA, test results, and PR URL.

If GitHub CLI (`gh`) or remote access is unavailable, stop after committing and explain exactly what remains to create the PR.
