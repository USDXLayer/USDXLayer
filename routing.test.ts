import test from "node:test"
import assert from "node:assert/strict"
import { buildDefaultGraph } from "../src/routing/graph.js"
import { enumeratePaths } from "../src/routing/paths.js"

test("enumeratePaths is deterministic", () => {
  const g = buildDefaultGraph()
  const a = enumeratePaths(g, "obs.parse", "acct.journal", 8, 256)
  const b = enumeratePaths(g, "obs.parse", "acct.journal", 8, 256)
  assert.equal(a.length, b.length)
  for (let i = 0; i < a.length; i++) assert.equal(a[i].id, b[i].id)
})
