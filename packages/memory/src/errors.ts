export class WorkerInitializationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WorkerInitializationError'
  }
}

export class MemoryLimitExceededError extends Error {
  constructor(limit: number, actual: number) {
    super(`Memory limit of ${limit} bytes exceeded (actual: ${actual} bytes)`)
    this.name = 'MemoryLimitExceededError'
  }
}
