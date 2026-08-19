# Append-only decision log

Write one JSON object per line to `decisions.jsonl`. Do not edit or remove prior
lines. Use `human_validation` after a maintainer response and `action_outcome`
when the approved action becomes terminal. For unattended integration, first
append one `standing_authorization` record pointing to the validated immutable
authorization artifact; append a `child_authorization_use` for every generated
child before external action.

```json
{"schema_version":1,"event":"standing_authorization","timestamp":"ISO-8601 UTC","repository":"owner/repository","umbrella_issue":"number-or-url","authorization":"absolute path","integration_branch":"non-default branch","outcome":{"status":"active"}}
```

```json
{"schema_version":1,"event":"child_authorization_use","timestamp":"ISO-8601 UTC","umbrella_issue":"number-or-url","child_issue":"number-or-url","accepted_plan_section":"stable heading/id","authorization":"absolute path","allowed_actions":["dispatch_delivery","create_draft_child_pr","merge_to_integration_branch"],"outcome":{"status":"pending"}}
```

## Review-page response contract

The review page copies one JSON object. Accept it only when `schema_version` is
`1`, `event` is `human_validation_response`, `run_id` matches this portfolio
run, and every response has a decision ID and item that appear in the rendered
plan. Accept only `approved`, `modified`, `rejected`, or `deferred`. Discard
unknown, duplicate, or malformed responses; ask the maintainer to correct them.
Questions must also match a rendered owner and decision ID, but do not require a
decision selection and never authorize an action.

```json
{
  "schema_version": 1,
  "event": "human_validation_response",
  "run_id": "portfolio-run-id",
  "responses": [
    {
      "decision_id": "stable identifier from the plan",
      "item_type": "issue|pull_request",
      "item": "number-or-url from the plan",
      "decision": "approved|modified|rejected|deferred",
      "final_approach": "required for modified; otherwise optional",
      "reason": "optional rationale"
    }
  ],
  "questions": [
    {
      "owner_id": "stable owner identifier from the plan",
      "decision_id": "stable identifier from the plan",
      "item_type": "issue|pull_request",
      "item": "number-or-url from the plan",
      "question": "maintainer's question"
    }
  ]
}
```

Map a valid response into the `human_response` object below. A `modified`
response is not executable until its updated approach receives a subsequent
`approved` response.

Record each valid question as an append-only owner follow-up event. Link its
answer artifact after the owner completes it.

```json
{
  "schema_version": 1,
  "event": "owner_follow_up",
  "decision_id": "matching decision identifier",
  "owner_id": "matching owner identifier",
  "timestamp": "ISO-8601 UTC",
  "question": "maintainer's question",
  "follow_up_mode": "resumable|replay_only",
  "answer_artifact": "absolute path",
  "outcome": {"status": "completed|failed|blocked"}
}
```

```json
{
  "schema_version": 1,
  "event": "human_validation",
  "decision_id": "stable identifier",
  "timestamp": "ISO-8601 UTC",
  "repository": "owner/repository",
  "item_type": "issue|pull_request",
  "item": "number-or-url",
  "llm_assessment": {
    "classification": "stale_resolved|superseded|delivery_candidate|needs_decision|track_only|defer",
    "evidence": ["specific fact"],
    "risk": "low|medium|high",
    "suggested_action": "close_with_comment|dispatch_delivery|defer|track"
  },
  "proposed_approach": "concise approach",
  "human_response": {
    "decision": "approved|modified|rejected|deferred",
    "final_approach": "approved or modified approach",
    "reason": "optional rationale"
  },
  "outcome": {"status": "pending"}
}
```

```json
{
  "schema_version": 1,
  "event": "action_outcome",
  "decision_id": "same identifier",
  "timestamp": "ISO-8601 UTC",
  "outcome": {"status": "completed|failed|blocked", "evidence": ["URL or artifact path"]}
}
```
