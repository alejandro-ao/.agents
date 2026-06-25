---
description: Prune git worktrees
---
Prune local git worktrees whose branches have already been merged into `main`.

Required workflow:

1. Inspect all git worktrees with `git worktree list`.
2. Fetch and update remote branch metadata before deciding what is merged.
3. Determine which worktree branches are already merged into `main`.
4. Do not remove the main worktree.
5. Do not remove worktrees with uncommitted changes, untracked important files, or branches that are not merged.
6. For each safe-to-remove merged worktree:
   - record the path and branch name
   - remove the worktree with `git worktree remove`
   - delete the local branch if it is fully merged and safe to delete
7. Run `git worktree prune` after removals.
8. Report what was removed, what was skipped, and why.

Ask for confirmation before deleting anything unless the user explicitly says deletion is approved.
