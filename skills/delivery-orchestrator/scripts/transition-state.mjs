#!/usr/bin/env node

import { appendFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const ACTIVE_STATES = new Set([
  "approved",
  "implementing",
  "verifying",
  "reviewing",
  "revising",
  "awaiting_final_approval",
]);
const TERMINAL_STATES = new Set(["completed_unmerged", "merged", "blocked", "failed", "cancelled"]);
const ALLOWED = {
  approved: ["implementing", "blocked", "cancelled"],
  implementing: ["verifying", "blocked", "failed", "cancelled"],
  verifying: ["reviewing", "revising", "blocked", "failed", "cancelled"],
  reviewing: ["revising", "awaiting_final_approval", "blocked", "failed", "cancelled"],
  revising: ["verifying", "blocked", "failed", "cancelled"],
  awaiting_final_approval: ["completed_unmerged", "merged", "blocked", "cancelled"],
};

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  if (!command) fail("Expected 'init' or 'transition'.");
  const values = { evidence: [] };
  for (let index = 0; index < rest.length; index += 2) {
    const flag = rest[index];
    const value = rest[index + 1];
    if (!flag?.startsWith("--") || value === undefined) fail(`Invalid argument near '${flag ?? ""}'.`);
    const key = flag.slice(2).replaceAll("-", "_");
    if (key === "evidence") values.evidence.push(value);
    else if (values[key] !== undefined) fail(`Argument '${flag}' may be supplied only once.`);
    else values[key] = value;
  }
  return { command, values };
}

function requireArgs(values, keys) {
  for (const key of keys) if (!values[key]) fail(`Missing --${key.replaceAll("_", "-")}.`);
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    fail(`Cannot read valid JSON from ${path}: ${error.message}`);
  }
}

async function atomicWrite(path, value) {
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, path);
}

function assertState(state) {
  if (!state || state.schema_version !== 1 || typeof state.run_id !== "string" ||
      typeof state.issue !== "string" || typeof state.status !== "string" ||
      ![...ACTIVE_STATES, ...TERMINAL_STATES].includes(state.status)) {
    fail("state.json does not match the delivery-state schema.");
  }
}

async function initialize(values) {
  requireArgs(values, ["run_dir", "run_id", "issue", "actor", "next_action"]);
  const statePath = join(values.run_dir, "state.json");
  const transitionsPath = join(values.run_dir, "transitions.jsonl");
  try {
    await readFile(statePath, "utf8");
    fail("Refusing to overwrite existing state.json.");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const timestamp = new Date().toISOString();
  const state = {
    schema_version: 1, run_id: values.run_id, issue: values.issue, status: "approved",
    updated_at: timestamp, actor: values.actor, decision: "Approved issue accepted for delivery.",
    next_action: values.next_action, evidence: values.evidence,
  };
  const transition = {
    timestamp, issue: values.issue, from: null, to: "approved", actor: values.actor,
    evidence: values.evidence, decision: state.decision, next_action: values.next_action,
  };
  await atomicWrite(statePath, state);
  await appendFile(transitionsPath, `${JSON.stringify(transition)}\n`, { encoding: "utf8", mode: 0o600 });
  process.stdout.write(`${JSON.stringify(state)}\n`);
}

async function transition(values) {
  requireArgs(values, ["run_dir", "to", "actor", "decision", "next_action"]);
  const statePath = join(values.run_dir, "state.json");
  const transitionsPath = join(values.run_dir, "transitions.jsonl");
  const state = await readJson(statePath);
  assertState(state);
  if (TERMINAL_STATES.has(state.status)) fail(`Cannot transition terminal state '${state.status}'.`);
  if (!ALLOWED[state.status]?.includes(values.to)) fail(`Transition '${state.status}' → '${values.to}' is not allowed.`);
  if (values.to === "merged" && !/approved/i.test(values.decision)) {
    fail("A merged transition requires evidence of explicit human approval in --decision.");
  }
  const timestamp = new Date().toISOString();
  const nextState = {
    ...state, status: values.to, updated_at: timestamp, actor: values.actor,
    decision: values.decision, next_action: values.next_action, evidence: values.evidence,
  };
  const record = {
    timestamp, issue: state.issue, from: state.status, to: values.to, actor: values.actor,
    evidence: values.evidence, decision: values.decision, next_action: values.next_action,
  };
  await atomicWrite(statePath, nextState);
  await appendFile(transitionsPath, `${JSON.stringify(record)}\n`, { encoding: "utf8", mode: 0o600 });
  process.stdout.write(`${JSON.stringify(nextState)}\n`);
}

const { command, values } = parseArgs(process.argv.slice(2));
if (command === "init") await initialize(values);
else if (command === "transition") await transition(values);
else fail(`Unknown command '${command}'.`);
