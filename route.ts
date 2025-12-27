import type { ActivityRecord } from "../types/core.js"
import type { Graph } from "./graph.js"
import type { CandidatePath } from "./paths.js"
import { DefaultPolicy } from "./policy.js"
import { hashObject } from "../utils/hash.js"

export interface PathPlan {
  selectedPath: CandidatePath
  score: { total: number; components: Record<string, number> }
  candidateCount: number
  contextHash: string
}

export function routeActivity(record: ActivityRecord, g: Graph, policy: DefaultPolicy, candidates: CandidatePath[]): PathPlan {
  const scored = candidates.map((p) => ({ p, s: policy.score(p, g, Number(record.normalizedVolumeUsd1)) }))
  scored.sort((a, b) => (b.s.total - a.s.total) || (a.p.id < b.p.id ? -1 : 1))
  const chosen = scored[0]
  const contextHash = hashObject({ record: record.contextHash, path: chosen.p.id, graph: hashObject(g) })
  return { selectedPath: chosen.p, score: chosen.s, candidateCount: candidates.length, contextHash }
}
