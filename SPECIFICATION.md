# USDX Layer Specification

## Summary

USDX Layer defines deterministic execution paths for USD1 based activity.
The system observes activity, selects routes subject to constraints, produces an execution plan, and journals results with integrity proofs.

## Deterministic rules

1. Event ordering is by timestamp then stable hash of fields
2. Candidate paths are enumerated in lexicographic id order
3. Scoring is pure and depends only on the activity record and path structure
4. Tie breaks are resolved by path id and node list
5. Journal entries are hash chained using canonical serialization
