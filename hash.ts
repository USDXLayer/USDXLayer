import { createHash } from "node:crypto"

export function stableStringify(obj: unknown): string {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj)
  if (Array.isArray(obj)) return "[" + obj.map(stableStringify).join(",") + "]"
  const rec = obj as Record<string, unknown>
  const keys = Object.keys(rec).sort()
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + stableStringify(rec[k])).join(",") + "}"
}

export function sha256(data: string): string {
  return createHash("sha256").update(data).digest("hex")
}

export function hashObject(obj: unknown): string {
  return sha256(stableStringify(obj))
}
