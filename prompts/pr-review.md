---
description: Review a pull request and produce a concise, precise quality report.
---

Review the following pull request: {{ arguments }}

Required workflow:

1. Identify the PR under review:
   - Treat the provided argument as the PR URL or PR number.
   - If the argument is missing, inspect the current git branch and associated GitHub PR when possible.
2. Inspect the PR scope:
   - Read the PR title, description, changed files, and diff.
   - Compare against the base branch, usually `main`, unless another base is provided.
3. Review for quality, correctness, and maintainability:
   - bugs, regressions, edge cases, and missing error handling
   - unclear or fragile logic
   - security, privacy, or data-loss risks
   - performance issues
   - API, schema, migration, or compatibility concerns
   - missing or weak tests
   - documentation gaps
   - unnecessary complexity or inconsistent style
4. Propose concrete fixes for each important issue:
   - reference the relevant file and line or code area when possible
   - explain why it matters
   - suggest a specific change, test, or follow-up
5. Provide a manual validation plan the user can run:
   - exact commands for tests, linters, builds, or local checks when discoverable
   - manual QA steps for the changed behavior
   - what successful validation should look like
6. Do not modify code unless the user explicitly asks you to implement fixes.
7. If information is unavailable, state the limitation and continue with the best available evidence.

Final report format:

- Verdict: approve / approve with comments / request changes
- Summary: 2-4 bullets on overall PR quality and risk
- Findings: prioritized list, grouped by severity: blocking, important, minor
- Suggested fixes: concise actionable recommendations
- Manual validation: commands and step-by-step checks for the user
- Open questions or assumptions, if any

Keep the report concise, but precise. Focus on issues that materially affect whether the PR should merge.
