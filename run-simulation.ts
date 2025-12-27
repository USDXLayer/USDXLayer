import { runSimulation } from "../src/simulation/runner.js"

function getArg(name: string, fallback: number): number {
  const idx = process.argv.indexOf(name)
  if (idx === -1) return fallback
  const v = Number(process.argv[idx + 1])
  return Number.isFinite(v) ? v : fallback
}

const runs = getArg("--runs", 200)
const seed = getArg("--seed", 7)

console.log(JSON.stringify(runSimulation(runs, seed), null, 2))
