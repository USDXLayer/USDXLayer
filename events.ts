import type { RawActivityEvent } from "../types/core.js"
import { hashObject } from "../utils/hash.js"

export function eventKey(e: RawActivityEvent): string {
  return hashObject({ kind: e.kind, amountUsd1: e.amountUsd1, ts: e.ts, source: e.source, meta: e.meta ?? {} })
}

export function stableOrderEvents(events: RawActivityEvent[]): RawActivityEvent[] {
  const withKey = events.map((e) => ({ e, k: eventKey(e) }))
  withKey.sort((a, b) => (a.e.ts - b.e.ts) || (a.k < b.k ? -1 : a.k > b.k ? 1 : 0))
  return withKey.map((x) => x.e)
}
