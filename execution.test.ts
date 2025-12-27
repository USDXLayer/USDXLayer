import test from "node:test"
import assert from "node:assert/strict"
import { buildDefaultGraph } from "../src/routing/graph.js"
import { enumeratePaths } from "../src/routing/paths.js"
import { InMemoryExecutionEngine } from "../src/execution/engine.js"

test("execution plan and settlement hashes are stable", () => {
  const g = buildDefaultGraph()
  const paths = enumeratePaths(g, "obs.parse", "acct.journal", 8, 16)
  const engine = new InMemoryExecutionEngine()
  const ctx = "a".repeat(64)
  const p = paths[0]
  const plan1 = engine.plan(p, ctx)
  const plan2 = engine.plan(p, ctx)
  assert.equal(plan1.planHash, plan2.planHash)
  const s1 = engine.settle(plan1)
  const s2 = engine.settle(plan2)
  assert.equal(s1.settlementHash, s2.settlementHash)
})
