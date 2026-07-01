---
description: Review a pull request in an isolated git worktree
---
Review the following pull request in an **isolated git worktree**: {{ arguments }}

Goal: perform the review without changing the user's current working tree, so they can keep working on their current branch while the review runs.

## Isolation rules

- Treat the repository where the command was invoked as the **original working tree**.
- Do not modify files, switch branches, run destructive git commands, or install dependencies in the original working tree.
- Only use the original working tree for read-only discovery, such as `pwd`, `git status --short`, `git remote -v`, `git branch --show-current`, and `git rev-parse --show-toplevel`.
- Perform PR checkout, inspection, tests, and any temporary files inside the review worktree.
- Do not modify code unless the user explicitly asks you to implement fixes.

## Review worktree location

Create review worktrees under:

`~/.agents/worktrees/<repo-name>/review-pr-<pr-number>/`

Where:
- `<repo-name>` is the basename of the repository root.
- `<pr-number>` is the GitHub PR number when available.
- If no PR number is available, use a short slug from the argument.

If the target directory already exists, reuse it only if it is already the correct review worktree. Otherwise choose a unique suffix, such as `review-pr-123-2`, or ask the user.

## Required workflow

1. Identify the PR and repository context:
   - Determine the repository root, current branch, remotes, and default/base branch.
   - Parse the PR number or URL from `{{ arguments }}`.
   - Use `gh pr view` when available to read the PR title, description, author, base branch, head branch, changed files, and metadata.
2. Create or update the isolated review worktree:
   - Fetch the PR head without checking it out in the original working tree.
   - Prefer a detached review worktree so no local branch blocks other worktrees:

```bash
git fetch origin pull/<pr-number>/head
git worktree add --detach <worktree-path> FETCH_HEAD
```

   - If the PR is not from GitHub or that ref is unavailable, use the equivalent remote/head ref discovered from `gh pr view` or ask before proceeding.
   - Fetch the base branch too, for example `git fetch origin <base-branch>`.
3. Do all review work inside the review worktree:
   - Inspect PR title, description, changed files, and diff.
   - Compare against the base branch, usually `origin/main` unless the PR specifies another base.
   - Use commands from inside the worktree, e.g. `cd <worktree-path> && ...`.
4. Review for quality, correctness, and maintainability:
   - bugs, regressions, edge cases, and missing error handling
   - unclear or fragile logic
   - security, privacy, or data-loss risks
   - performance issues
   - API, schema, migration, or compatibility concerns
   - missing or weak tests
   - documentation gaps
   - unnecessary complexity or inconsistent style
5. Run targeted validation when reasonable:
   - Prefer focused tests, linters, type checks, or builds that are discoverable from project files.
   - Avoid very expensive or destructive commands unless the user asked for them.
   - Record exact commands and results.
6. Propose concrete fixes for each important issue:
   - reference the relevant file and line or code area when possible
   - explain why it matters
   - suggest a specific change, test, or follow-up
7. If information is unavailable, state the limitation and continue with the best available evidence.

## Cleanup

Do not remove the review worktree automatically unless the user asks. Include the cleanup command in the final report, for example:

```bash
git worktree remove <worktree-path>
```

## Final report format

- Worktree: path used for the review
- PR: number/title/base/head when available
- Verdict: approve / approve with comments / request changes
- Summary: 2-4 bullets on overall PR quality and risk
- Findings: prioritized list grouped by severity: blocking, important, minor
- Suggested fixes: concise actionable recommendations
- Validation: commands run and results, plus manual checks the user can run
- Cleanup: command to remove the review worktree when done
- Open questions or assumptions, if any

Keep the report concise, but precise. Focus on issues that affect whether the PR should merge.
