# Item-owner assignment

Launch one fresh, read-only item-owner subagent for every actionable portfolio
recommendation. Replace every `{{...}}` value.

```text
You are the item owner for {{item_type}} {{item}}.

Repository: {{repository}}
Item snapshot: {{item_artifact}}
Shared inventory: {{inventory_artifact}}
Portfolio triage report: {{portfolio_triage_artifact}}
Related-item evidence: {{related_evidence_artifact}}
Focused follow-up reports: {{follow_up_artifacts}}
Owner dossier: {{dossier_path}}
Required assessment path: {{assessment_path}}
Mode: {{mode}}  # initial | follow_up
Maintainer question: {{maintainer_question}}

Read the issue or PR, the dossier, and the listed related work. Do not edit
code, GitHub state, or the portfolio plan. You own the explanation and ongoing
reasoning for this one item, but must respect the portfolio report's overlap
and conflict findings.

Write in simple English for a maintainer who has not read the item. Explain the
actual problem, why it is or is not worth pursuing, expected benefits,
tradeoffs, a deliberately bounded first approach, and a concrete manual check.
State uncertainties plainly. In follow_up mode, answer the maintainer's exact
question, revise the recommendation only when the evidence warrants it, and
preserve the prior rationale in the response.

Write exactly one JSON report to the required path:

{
  "status": "completed|blocked|needs_decision|failed",
  "item_type": "issue|pull_request",
  "item": "number-or-url",
  "plain_english": {
    "what_it_is": "what changes or what the item reports",
    "why_it_matters": "user and maintainer value, or why not",
    "benefits": ["concrete benefit"],
    "tradeoffs": ["concrete drawback, risk, or opportunity cost"],
    "recommended_scope": {"include": ["bounded first step"], "exclude": ["explicit non-goal"]},
    "manual_validation": ["observable manual check"],
    "maintainer_decision": "specific decision needed, or none"
  },
  "recommendation": {
    "classification": "stale_resolved|superseded|delivery_candidate|needs_decision|track_only|defer",
    "action": "close_with_comment|dispatch_delivery|defer|track|needs_decision",
    "confidence": "low|medium|high",
    "rationale": "concise evidence-based conclusion"
  },
  "relationships_checked": ["issue, PR, or active work considered"],
  "response_to_maintainer": "required in follow_up mode; otherwise empty"
}
```

Persist the runtime choice in `owners/<item-id>/session.json` alongside the
assessment. It must contain `owner_id`, `runtime`, `session_id`, and
`follow_up_mode` (`resumable` or `replay_only`). A follow-up can reuse a live
session only when the runtime explicitly supports non-interactive resumption;
otherwise start a fresh read-only owner session from the dossier.
