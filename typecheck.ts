import { spawnSync } from "node:child_process"

const r = spawnSync("npx", ["tsc", "-p", "tsconfig.json", "--noEmit"], { stdio: "inherit" })
process.exit(r.status ?? 1)
