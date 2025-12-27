import { hashObject } from "../utils/hash.js"

export interface Node {
  id: string
  kind: "observation" | "routing" | "execution" | "accounting"
}

export interface Edge {
  id: string
  from: string
  to: string
  weight: number
}

export interface Graph {
  nodes: Record<string, Node>
  edges: Record<string, Edge>
  adjacency: Record<string, string[]>
}

export function buildDefaultGraph(): Graph {
  const nodes: Record<string, Node> = {
    "obs.parse": { id: "obs.parse", kind: "observation" },
    "obs.norm": { id: "obs.norm", kind: "observation" },
    "route.select": { id: "route.select", kind: "routing" },
    "exec.plan": { id: "exec.plan", kind: "execution" },
    "exec.settle": { id: "exec.settle", kind: "execution" },
    "acct.journal": { id: "acct.journal", kind: "accounting" }
  }
  const edgesArr: Edge[] = [
    { id: "e1", from: "obs.parse", to: "obs.norm", weight: 1 },
    { id: "e2", from: "obs.norm", to: "route.select", weight: 1 },
    { id: "e3", from: "route.select", to: "exec.plan", weight: 1 },
    { id: "e4", from: "exec.plan", to: "exec.settle", weight: 1 },
    { id: "e5", from: "exec.settle", to: "acct.journal", weight: 1 }
  ]
  const edges: Record<string, Edge> = {}
  const adjacency: Record<string, string[]> = {}
  for (const id of Object.keys(nodes)) adjacency[id] = []
  for (const e of edgesArr) {
    edges[e.id] = e
    adjacency[e.from].push(e.id)
  }
  for (const k of Object.keys(adjacency)) adjacency[k].sort()
  return { nodes, edges, adjacency }
}

export function graphHash(g: Graph): string {
  return hashObject(g)
}
