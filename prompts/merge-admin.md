---
description: Merge a pull request through GitHub, then sync local main
---
Merge the following pull request through GitHub and sync local `main`: $ARGUMENTS

Required workflow:

1. Inspect the PR and repository state and fetch the latest remote refs.

2. Ensure the PR branch is merge-ready:
   - Merge the latest base branch into the PR branch if needed and resolve conflicts carefully.
   - Run the relevant tests, linters, type checks, or build commands from CI discovered in the project and push the resolved PR branch back to GitHub.
   - Describe what you did and ask the user to manually validate that everything is ok before merging.

3. If the PR is clean and checks are acceptable, merge through GitHub:
   - Use `gh pr merge <PR> --squash` by default. Only use `--merge`, or `--rebase` if the user explicitly asks for these methods
   - Before considering an admin override, compare the authenticated GitHub login from `gh api user --jq .login` with the PR author's login from `gh pr view <PR> --json author --jq .author.login`.
   - If the PR was created by the authenticated user, is cleanly mergeable, and required checks pass, use `--admin` when branch protection is the only remaining blocker (for example, a required approving review). Do not use `--admin` for another author's PR.
   - Never use `--admin` to bypass conflicts or failing/pending required checks.
   - Delete the PR branch only if the user requested it or it is clearly safe.

4. Sync local repository after the GitHub merge:
   - Switch to the base branch.
   - Pull with fast-forward only, for example `git pull --ff-only origin main`.
   - Confirm local `HEAD` matches the updated remote base branch.
   - If there are uncommited changes in base branch: stash them, pull and stash apply them back. 

6. Final response:
   - State whether the PR was merged.
   - Include the merge method used.
   - Include the squash or merge commit message used.
   - Mention any tests/checks run and their results.
   - If the PR was not merged, explain exactly what remains and what the user should validate.

Important constraints:

- Do not merge a conflicted PR directly into the base branch.
- If conflict resolution or code changes are needed, resolve them on the PR branch first, push them, and ask the user to validate before merging.
- Do not discard, reset, or overwrite unrelated user changes without explicit permission.
- Prefer GitHub PR merging over local merges to preserve GitHub PR merge history.
