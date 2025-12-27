import type { Graph } from "./graph.js"
import { hashObject } from "../utils/hash.js"

export interface CandidatePath {
  id: string
  nodeIds: string[]
  edgeIds: string[]
  baseWeight: number
}

export function enumeratePaths(g: Graph, start: string, goal: string, maxLen: number, maxCandidates: number): CandidatePath[] {
  const out: CandidatePath[] = []
  const stack: { node: string; nodes: string[]; edges: string[]; weight: number }[] = [{ node: start, nodes: [start], edges: [], weight: 0 }]

  while (stack.length && out.length < maxCandidates) {
    const cur = stack.pop()!
    if (cur.nodes.length > maxLen) continue
    if (cur.node === goal) {
      const id = hashObject({ nodes: cur.nodes, edges: cur.edges })
      out.push({ id, nodeIds: cur.nodes, edgeIds: cur.edges, baseWeight: cur.weight })
      continue
    }
    const nextEdges = g.adjacency[cur.node] ?? []
    for (let i = nextEdges.length - 1; i >= 0; i--) {
      const eid = nextEdges[i]
      const e = g.edges[eid]
      const next = e.to
      if (cur.nodes.includes(next)) continue
      stack.push({ node: next, nodes: [...cur.nodes, next], edges: [...cur.edges, eid], weight: cur.weight + e.weight })
    }
  }

  out.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
  return out
}
