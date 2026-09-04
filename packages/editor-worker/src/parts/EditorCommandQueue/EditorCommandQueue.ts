const queues: Record<string, Promise<void> | undefined> = {}

export const run = async <T>(key: string | number, fn: () => Promise<T>): Promise<T> => {
  const previous = queues[key]
  const { promise: next, resolve } = Promise.withResolvers<void>()
  queues[key] = next
  if (previous) {
    await previous
  }
  try {
    return await fn()
  } finally {
    resolve()
    if (queues[key] === next) {
      delete queues[key]
    }
  }
}
