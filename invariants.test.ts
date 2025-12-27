import test from "node:test"
import assert from "node:assert/strict"
import { observeActivity } from "../src/observation/normalizer.js"
import { buildDefaultGraph } from "../src/routing/graph.js"
import { enumeratePaths } from "../src/routing/paths.js"
import { DefaultPolicy } from "../src/routing/policy.js"
import { routeActivity } from "../src/routing/route.js"
import { InMemoryExecutionEngine } from "../src/execution/engine.js"
import { appendJournal, verifyJournal } from "../src/accounting/journal.js"

test("determinism invariant", () => {
  const events = [
    { kind: "transfer", amountUsd1: "10.00", ts: 1700000000, source: "test" },
    { kind: "swap", amountUsd1: "1.25", ts: 1700000001, source: "test" }
  ] as any

  const g = buildDefaultGraph()
  const policy = new DefaultPolicy()
  const candidates = enumeratePaths(g, "obs.parse", "acct.journal", 8, 256)
  const engine = new InMemoryExecutionEngine()

  const r1 = observeActivity(events)
  const p1 = routeActivity(r1, g, policy, candidates)
  const plan1 = engine.plan(p1.selectedPath, p1.contextHash)
  const set1 = engine.settle(plan1)

  const r2 = observeActivity(events)
  const p2 = routeActivity(r2, g, policy, candidates)
  const plan2 = engine.plan(p2.selectedPath, p2.contextHash)
  const set2 = engine.settle(plan2)

  assert.equal(plan1.planHash, plan2.planHash)
  assert.equal(set1.settlementHash, set2.settlementHash)

  const j = appendJournal(undefined, plan1.planHash, set1.settlementHash)
  verifyJournal(j)
  assert.equal(j.rootHash.length, 64)
})
