# Product-owner final report template

The orchestrator must end with this concise, plain-language report. Lead with
product impact and decision status; keep operational details secondary. Do not
include raw transcripts.

```markdown
# Delivery report — <issue title>

## Decision
**<Ready for manual validation and merge approval | Changes required | Blocked>**

<One or two sentences describing the user-visible result and final verdict.>

## Product impact
- **What changed:** <plain-language behavior>
- **Application areas touched:** <frontend/TUI, backend, provider layer, core agent, docs, etc.>
- **Not touched:** <important unaffected areas, especially sensitive layers>
- **Issue:** <link>

## Delivery
- **Pull request:** <link or none> (<draft/open state>)
- **Implementation worktree:** `<absolute path or none>`
- **Branch / commit:** `<branch>` / `<candidate commit>`
- **How to validate manually:** <short steps or command>

## Agent work
| Agent | Session ID | Outcome | What it did |
|---|---|---|---|
| Triage | `<exact ID>` | <outcome> | <one line> |
| Implementation | `<exact ID>` | <outcome> | <one line> |
| Revision 1 | `<exact ID>` | <outcome> | <one line, omit when none> |
| Review 1 | `<exact ID>` | <verdict> | <one line> |
| Re-review 1 | `<exact ID>` | <verdict> | <one line, omit when none> |

## Scores and verification
- **Selection score:** <score>/<threshold>; hard gate <pass/fail>; risk <level>
- **Review scores:**
  - Review 1: <overall>/100 — correctness <n>, tests <n>, architecture <n>, scope <n>, maintainability <n>, docs <n>
  - Re-review 1: <overall>/100 — <same dimensions; omit when none>
- **Checks:** <commands and concise outcomes>
- **CI:** <status>

## Findings and remaining risk
- **Resolved:** <important findings fixed, or none>
- **Still open:** <suggestions or blockers, or none>
- **Manual validation gaps:** <items or none>

## Next action
<Exact human decision/action needed. If merge approval is needed, name the PR
and state that it remains unmerged until explicit approval.>

<details>
<summary>Run details</summary>

- Run ID: `<run ID>`
- Run artifacts: `<absolute path>`
- Specialist rounds: triage <n>; implementation <n> (initial <n>, revisions <n>); review <n> (initial <n>, re-reviews <n>)
- Launch failures/retries: <items or none>
- Human overrides: <items or none>
- Final workflow state: `<state>`

</details>
```
