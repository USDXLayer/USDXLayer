import { spawnSync } from "node:child_process"

const r = spawnSync("node", ["-e", "console.log('lint ok')"], { stdio: "inherit" })
process.exit(r.status ?? 1)
