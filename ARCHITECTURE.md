# USDX Layer Reference Architecture

## Overview

USDX Layer is organized as a set of modules with strict boundaries.

Observation transforms external events into internal records.
Routing selects deterministic paths through a policy constrained directed graph.
Execution constructs and settles an ordered plan.
Accounting journals results and provides integrity proofs.

## Data flow

Events -> ActivityRecord -> PathPlan -> ExecutionPlan -> Settlement -> Journal

## Determinism points

Determinism is enforced at event ordering, normalization rules, candidate path enumeration order, scoring purity, stable sorting, and journal hash chaining.
