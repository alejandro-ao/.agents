---
description: Triage open PRs and issues by relevance and complexity.
---

Triage the open PRs and issues in this repo.

Use `gh pr list --state open` and `gh issue list --state open` (with `--json` for
number, title, author, additions/deletions, changedFiles, mergeStateStatus,
isDraft, reviewDecision) to fetch them. Read the PR/issue bodies for the ones
that look non-trivial.

Classify into:

1. **Low-hanging fruit** — small, focused, well-described, with tests, addressing
   a real bug or gap. Note which need a rebase (`BEHIND`/`DIRTY`) vs. just a
   review (`BLOCKED` / `REVIEW_REQUIRED`).
2. **Important but not trivial** — larger changes that raise a real issue or add
   new surface area and deserve careful review (not a quick merge).
3. **Already addressed by an open PR** — issue → PR mapping, so nothing is
   duplicated.

For issues, do the same by complexity, and flag:
- high-priority bugs / user pain,
- architecture/direction decisions that block other work,
- small enhancements worth queuing.

End with a suggested action order: tiny safe merges first, then small bug fixes,
then medium UX/data PRs, then the items needing dedicated review time.
