import { hashObject } from "../utils/hash.js"

export interface JournalEntry {
  idx: number
  prevHash: string
  planHash: string
  settlementHash: string
  entryHash: string
}

export interface Journal {
  entries: JournalEntry[]
  rootHash: string
}

export function appendJournal(j: Journal | undefined, planHash: string, settlementHash: string): Journal {
  const prevHash = j ? j.rootHash : "0".repeat(64)
  const idx = j ? j.entries.length : 0
  const entryHash = hashObject({ idx, prevHash, planHash, settlementHash })
  const entry: JournalEntry = { idx, prevHash, planHash, settlementHash, entryHash }
  const entries = j ? [...j.entries, entry] : [entry]
  return { entries, rootHash: entryHash }
}

export function verifyJournal(j: Journal): void {
  let prev = "0".repeat(64)
  for (let i = 0; i < j.entries.length; i++) {
    const e = j.entries[i]
    const expected = hashObject({ idx: i, prevHash: prev, planHash: e.planHash, settlementHash: e.settlementHash })
    if (e.idx !== i || e.prevHash !== prev || e.entryHash !== expected) throw new Error("journal integrity failure")
    prev = e.entryHash
  }
  if (j.rootHash !== prev) throw new Error("journal root hash mismatch")
}
