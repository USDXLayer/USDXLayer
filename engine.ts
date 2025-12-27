import { hashObject } from "../utils/hash.js"
import type { CandidatePath } from "../routing/paths.js"

export interface ExecutionStep {
  id: string
  kind: "route" | "emit"
  nodeId: string
  inputHash: string
  outputHash: string
  params: Record<string, string>
}

export interface ExecutionPlan {
  steps: ExecutionStep[]
  planHash: string
}

export interface Receipt {
  stepId: string
  ok: boolean
  detail: string
  receiptHash: string
}

export interface Settlement {
  planHash: string
  receipts: Receipt[]
  settlementHash: string
}

export class InMemoryExecutionEngine {
  plan(path: CandidatePath, contextHash: string): ExecutionPlan {
    const steps: ExecutionStep[] = []
    let cursor = contextHash
    for (let i = 0; i < path.nodeIds.length; i++) {
      const nodeId = path.nodeIds[i]
      const kind = i === path.nodeIds.length - 1 ? "emit" : "route"
      const id = hashObject({ nodeId, i, cursor })
      const params = { i: String(i), nodeId }
      const outputHash = hashObject({ cursor, params })
      steps.push({ id, kind, nodeId, inputHash: cursor, outputHash, params })
      cursor = outputHash
    }
    return { steps, planHash: hashObject({ steps, pathId: path.id, contextHash }) }
  }

  settle(plan: ExecutionPlan): Settlement {
    const receipts: Receipt[] = []
    let cursor = plan.planHash
    for (const s of plan.steps) {
      const ok = s.inputHash.length === 64 && s.outputHash.length === 64
      const receiptHash = hashObject({ stepId: s.id, ok, cursor })
      receipts.push({ stepId: s.id, ok, detail: ok ? "ok" : "fail", receiptHash })
      cursor = receiptHash
    }
    return { planHash: plan.planHash, receipts, settlementHash: hashObject({ planHash: plan.planHash, receipts }) }
  }
}
