import { ValidationError } from "../types/errors.js"

export function parseDecimal(s: string): number {
  const n = Number(s)
  if (!Number.isFinite(n) || n < 0) throw new ValidationError(`invalid decimal: ${s}`)
  return n
}

export function formatDecimal(n: number, digits = 6): string {
  if (!Number.isFinite(n) || n < 0) throw new ValidationError(`invalid number: ${n}`)
  return n.toFixed(digits).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1")
}
