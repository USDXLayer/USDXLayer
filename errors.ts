export class USDXError extends Error {
  readonly code: string
  constructor(code: string, message: string) {
    super(message)
    this.code = code
  }
}

export class ValidationError extends USDXError {
  constructor(message: string) {
    super("VALIDATION_ERROR", message)
  }
}

export class ConstraintError extends USDXError {
  constructor(message: string) {
    super("CONSTRAINT_ERROR", message)
  }
}

export class DeterminismError extends USDXError {
  constructor(message: string) {
    super("DETERMINISM_ERROR", message)
  }
}
