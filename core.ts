export type UnixSeconds = number

export interface RawActivityEvent {
  kind: "transfer" | "swap" | "deposit" | "withdraw" | "payment"
  amountUsd1: string
  ts: UnixSeconds
  source: string
  meta?: Record<string, string>
}

export interface ActivityRecord {
  orderedEvents: RawActivityEvent[]
  volumeUsd1: string
  normalizedVolumeUsd1: string
  contextHash: string
  windowStart: UnixSeconds
  windowEnd: UnixSeconds
}
