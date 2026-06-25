---
description: Merge a pull request through GitHub, then sync local main
---
Merge the following pull request through GitHub and sync local `main`: {{ arguments }}

Required workflow:

1. Inspect the PR and repository state:
   - Confirm the PR number, title, base branch, and head branch with `gh pr view`.
   - Check local status with `git status --short` and do not overwrite unrelated local work.
   - Fetch the latest remote refs.

2. Ensure the PR branch is merge-ready:
   - Check whether the PR can merge cleanly into its base branch, usually `main` unless the PR uses another base.
   - If GitHub or local checks indicate the merge is not clean:
     1. Check out the PR branch locally.
     2. Merge the latest base branch into the PR branch.
     3. Resolve conflicts carefully.
     4. Run the relevant tests, linters, type checks, or build commands discovered in the project.
     5. Push the resolved PR branch back to GitHub.
     6. Ask the user to manually validate that everything works.
     7. Do not merge the PR into the base branch until the user confirms validation is successful.

3. If the PR is clean and checks are acceptable:
   - Summarize what will be merged and which merge method you plan to use.
   - Prefer merging on GitHub with `gh pr merge` so GitHub history shows the PR was merged into the base branch.
   - Use the merge method requested by the user. If none is specified, ask whether to use squash, merge commit, or rebase. Do not assume for important projects.

4. Merge through GitHub:
   - Use `gh pr merge <PR> --squash`, `--merge`, or `--rebase` as confirmed by the user.
   - Delete the PR branch only if the user requested it or it is clearly safe.

5. Sync local repository after the GitHub merge:
   - Switch to the base branch.
   - Pull with fast-forward only, for example `git pull --ff-only origin main`.
   - Confirm local `HEAD` matches the updated remote base branch.

6. Final response:
   - State whether the PR was merged.
   - Include the merge method used.
   - Include the final local branch and commit.
   - Mention any tests/checks run and their results.
   - If the PR was not merged, explain exactly what remains and what the user should validate.

Important constraints:

- Do not merge a conflicted PR directly into the base branch.
- If conflict resolution or code changes are needed, resolve them on the PR branch first, push them, and ask the user to validate before merging.
- Do not discard, reset, or overwrite unrelated user changes without explicit permission.
- Prefer GitHub PR merging over local merges to preserve GitHub PR merge history.
