![USDX Layer](usdxlayer.png)

# USDX Layer

A deterministic execution and routing abstraction derived from USD1 usage.

USDX Layer defines execution paths, constraints, and auditability primitives for USD1 based economic activity.
USDX Layer does not custody, wrap, or modify USD1. USD1 remains the stable unit of account.
USDX Layer observes USD1 activity, selects deterministic routes, and produces execution plans with verifiable integrity.

## Abstract

USDX Layer is a modular software specification and reference implementation for routing USD1 activity through deterministic execution paths.
The system is designed to be non custodial, deterministic under identical inputs, and verifiable via hash chained journals.
USDX Layer is intended to be used as an SDK and as a reference architecture for execution systems that require predictable behavior.

## Non goals

- USDX Layer is not a bridge
- USDX Layer is not a wrapper for USD1
- USDX Layer is not a yield product
- USDX Layer does not provide governance controls over execution outcomes
- USDX Layer does not assume any specific chain integration

## Design principles

- Determinism: identical inputs yield identical plans and journals
- Separation: observation, routing, execution, and accounting are isolated modules
- Non custody: no component requires holding USD1
- Auditability: all steps are journaled and integrity checked
- Minimal assumptions: execution targets are abstracted via interfaces

## Architecture overview

```
            +----------------------+
            |      USD1 world      |
            |  swaps, payments,    |
            |  deposits, transfers |
            +----------+-----------+
                       |
                       v
            +----------------------+
            |   Observation Layer  |
            |  parse, normalize,   |
            |  validate, measure   |
            +----------+-----------+
                       |
                       v
            +----------------------+
            |     Routing Layer    |
            |  graph, policy,      |
            |  constraints, paths  |
            +----------+-----------+
                       |
                       v
            +----------------------+
            |   Execution Layer    |
            |  plan, hooks,        |
            |  deterministic settle|
            +----------+-----------+
                       |
                       v
            +----------------------+
            |  Accounting Layer    |
            |  ledger, journal,    |
            |  integrity proofs    |
            +----------------------+
```

## Repository layout

- src/observation: event parsing, volume measurement, normalization
- src/routing: graph model, path selection, constraints, policy
- src/execution: execution engine, deterministic step ordering, settlement
- src/accounting: ledger and journal for auditability
- src/simulation: scenario generator and Monte Carlo runner
- test: determinism and invariant tests
- scripts: local entrypoints for simulation and checks

## Deterministic routing model

Routing is performed over a directed graph G(V, E) where nodes represent execution modules and edges represent allowable transitions.
A policy constrains both admissible nodes and admissible edges.
Path selection is deterministic and based on a stable sort over candidate paths with a pure scoring function.

## Execution lifecycle

1. Observe: ingest USD1 activity events, produce ActivityRecord
2. Normalize: compute normalized volume and attach context hash
3. Route: compute candidate paths, apply constraints, select winner
4. Plan: build ExecutionPlan using deterministic ordering
5. Settle: simulate settlement producing receipts
6. Journal: append plan and receipts into a hash chained journal
7. Verify: verify invariants and integrity proofs

## Example usage

```bash
npm install
npm run typecheck
npm test
npm run sim -- --runs 200 --seed 7
```

```ts
import { buildDefaultGraph, DefaultPolicy, observeActivity, routeActivity, planExecution, settleExecution } from "./src/index.js"

const events = [
  { kind: "transfer", amountUsd1: "125.50", ts: 1700000000, source: "example" },
  { kind: "swap", amountUsd1: "31.25", ts: 1700000060, source: "example" }
]

const activity = observeActivity(events)
const graph = buildDefaultGraph()
const policy = new DefaultPolicy()

const pathPlan = routeActivity(activity, graph, policy)
const execPlan = planExecution(activity, pathPlan)
const settlement = settleExecution(execPlan)

console.log(pathPlan.selectedPath.nodeIds)
console.log(settlement.receipts.length)
```

## License

MIT. See LICENSE.
