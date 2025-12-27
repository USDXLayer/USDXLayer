import type { ActivityRecord, RawActivityEvent } from "../types/core.js"
import { parseDecimal, formatDecimal } from "../utils/math.js"
import { hashObject } from "../utils/hash.js"
import { stableOrderEvents } from "./events.js"

export function observeActivity(events: RawActivityEvent[]): ActivityRecord {
  const ordered = stableOrderEvents(events)
  let volume = 0
  for (const e of ordered) volume += parseDecimal(e.amountUsd1)

  const normalized = Math.log10(1 + Math.max(0, volume)) * 100
  const ts = ordered.map((e) => e.ts)
  const windowStart = Math.min(...ts)
  const windowEnd = Math.max(...ts)

  return {
    orderedEvents: ordered,
    volumeUsd1: formatDecimal(volume, 6),
    normalizedVolumeUsd1: formatDecimal(Number.isFinite(normalized) ? normalized : 0, 6),
    contextHash: hashObject({ ordered, volume: formatDecimal(volume, 6) }),
    windowStart,
    windowEnd
  }
}
