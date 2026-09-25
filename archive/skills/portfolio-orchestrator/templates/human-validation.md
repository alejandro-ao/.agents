# Human validation plan

Render this Markdown file and the companion `human-validation.html` after triage
and before any external action. Group items into Cleanup candidates, Delivery
candidates, Needs your decision, Track only, and Deferred. For each actionable
item, use its owner assessment to include: what it is, why it matters, benefits,
tradeoffs, recommended scope, manual validation, any maintainer decision,
links, supporting evidence, proposed action, owner ID, and decision ID.

Write the populated HTML page to `<portfolio-run>/human-validation.html`. It
must be self-contained: no network requests, remote scripts, or unescaped
repository/LLM content. Populate its cards only from the reviewed plan. The
page's copied JSON is an input to validate, not authorization by itself; use the
response contract in `decision-log.md` before recording a decision.

Each actionable card must include a question field. A pasted question is routed
to that item's owner agent and produces an updated assessment; it is never an
approval or permission for an external action.

Ask the maintainer to respond to each actionable item with one of:

- `approve` — apply the proposed action;
- `modify: <approach>` — use the stated approach, then record it for approval;
- `reject` — take no action;
- `defer` — revisit later without external action.

Do not comment, close, relabel, dispatch delivery, or merge until the matching
item has an `approve` response recorded in `decisions.jsonl`. In validated
unattended integration mode, generated child items traceable to the accepted
umbrella plan inherit its standing authorization for dispatch and merge only to
the named non-default integration branch. Record that authorization and mapping;
all other actions still require an item response.
