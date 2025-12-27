import { observeActivity } from "../observation/normalizer.js"
import { buildDefaultGraph } from "../routing/graph.js"
import { enumeratePaths } from "../routing/paths.js"
import { DefaultPolicy } from "../routing/policy.js"
import { routeActivity } from "../routing/route.js"
import { InMemoryExecutionEngine } from "../execution/engine.js"
import { appendJournal, verifyJournal } from "../accounting/journal.js"

export function runSimulation(runs: number, seed: number): { runs: number; determinismOk: number; journalOk: number } {
  let determinismOk = 0
  let journalOk = 0
  const g = buildDefaultGraph()
  const policy = new DefaultPolicy()
  const engine = new InMemoryExecutionEngine()
  const candidates = enumeratePaths(g, "obs.parse", "acct.journal", 8, 256)

  function rng(): number {
    seed ^= seed << 13
    seed ^= seed >> 17
    seed ^= seed << 5
    return ((seed >>> 0) / 0xffffffff)
  }

  for (let i = 0; i < runs; i++) {
    const baseTs = 1700000000 + i * 100
    const events = Array.from({ length: 10 }, (_, j) => ({
      kind: (["transfer", "swap", "deposit", "withdraw", "payment"] as const)[Math.floor(rng() * 5)],
      amountUsd1: (rng() * 250).toFixed(2),
      ts: baseTs + j * Math.floor(rng() * 10 + 1),
      source: "sim"
    }))
    const r1 = observeActivity(events as any)
    const p1 = routeActivity(r1, g, policy, candidates)
    const plan1 = engine.plan(p1.selectedPath, p1.contextHash)
    const set1 = engine.settle(plan1)

    const r2 = observeActivity(events as any)
    const p2 = routeActivity(r2, g, policy, candidates)
    const plan2 = engine.plan(p2.selectedPath, p2.contextHash)
    const set2 = engine.settle(plan2)

    if (plan1.planHash === plan2.planHash && set1.settlementHash === set2.settlementHash) determinismOk += 1

    const journal = appendJournal(undefined, plan1.planHash, set1.settlementHash)
    try {
      verifyJournal(journal)
      journalOk += 1
    } catch {
      // ignore
    }
  }

  return { runs, determinismOk, journalOk }
}
