In every interaction, be concise and straight to the point. Sacrifice grammar for the sake of concision.

## Herdr session orchestration

When `HERDR_ENV=1`, this Tau session runs inside Herdr. Use the `herdr` skill and CLI for explicit Herdr requests; do not control Herdr when `HERDR_ENV` is unset.

When the user asks to create or spawn a new Tau session, create a new Herdr workspace unless they explicitly request a sibling pane in the current workspace. Use `herdr workspace create`, parse the returned `.result.root_pane.pane_id`, then launch the child with `herdr pane run <pane-id> "exec tau <prompt>"`. Preserve the user's focus with `--no-focus` and safely shell-quote prompts.

Every Tau session running inside Herdr should get a concise prompt-derived display name after its initial prompt is known. Report it with:

```bash
herdr pane report-metadata "$HERDR_PANE_ID" \
  --source tau-session-name \
  --agent tau \
  --display-agent "<prompt-derived name>"
```

Keep the underlying agent identity as `tau`; this only changes the human-readable Herdr sidebar label. Never close or send input to the current pane unless explicitly requested.
