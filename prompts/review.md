---
description: Review a pull request
---
Review the following pull request: {{ arguments }}

Required workflow:

1. Inspect the PR scope:
   - Read the PR title, description, changed files, and diff.
   - Compare against the base branch, usually `main`, unless another base is provided.
2. Review for quality, correctness, and maintainability:
   - bugs, regressions, edge cases, and missing error handling
   - unclear or fragile logic
   - security, privacy, or data-loss risks
   - performance issues
   - API, schema, migration, or compatibility concerns
   - missing or weak tests
   - documentation gaps
   - unnecessary complexity or inconsistent style
3. Propose concrete fixes for each important issue:
   - reference the relevant file and line or code area when possible
   - explain why it matters
   - suggest a specific change, test, or follow-up
4. Provide a manual validation plan the user can run:
   - exact commands for tests, linters, builds, or local checks when discoverable
   - manual QA steps for the changed behavior
   - what successful validation should look like
5. Do not modify code unless the user explicitly asks you to implement fixes.
6. If information is unavailable, state the limitation and continue with the best available evidence.

Final report format:

- Verdict: approve / approve with comments / request changes
- Summary: 2-4 bullets on overall PR quality and risk
- Findings: prioritized list, grouped by severity: blocking, important, minor
- Suggested fixes: concise actionable recommendations
- Manual validation: commands and step-by-step checks for the user
- Open questions or assumptions, if any

Keep the report concise, but precise. Focus on issues that affect whether the PR should merge.
