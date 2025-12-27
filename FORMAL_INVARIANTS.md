# Formal Invariants

## I1 Non custody

The system must not store or require balances of USD1.

## I2 Determinism

Given identical inputs and config, routing and execution must return identical outputs.

## I3 Journal integrity

Each journal entry links to the previous entry hash and the root hash is reproducible.

## I4 Policy compliance

Selected paths must satisfy all constraints and fail closed.
