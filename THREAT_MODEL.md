# USDX Layer Threat Model

## Input manipulation

Adversaries may attempt volume spoofing or adversarial event ordering.
Mitigations rely on normalization, deterministic ordering, policy constraints, and journaling integrity.

## Graph and policy tampering

Mitigations include immutable snapshots and including content hashes in plan context.

## Integrity attacks

Mitigations include hash chained journals and verification routines.
