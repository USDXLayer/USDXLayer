import type { Graph } from "./graph.js"
import type { CandidatePath } from "./paths.js"

export interface PathScore {
  total: number
  components: Record<string, number>
}

export class DefaultPolicy {
  score(path: CandidatePath, _g: Graph, normalizedVolume: number): PathScore {
    const lenPenalty = path.nodeIds.length * 0.1
    const weightPenalty = path.baseWeight
    const volumeFactor = Math.min(10, normalizedVolume) * 0.01
    const total = 100 - weightPenalty - lenPenalty + volumeFactor
    return { total, components: { weight: -weightPenalty, length: -lenPenalty, volumeFactor } }
  }
}
