import * as Editors from '../EditorStates/EditorStates.ts'

const queues: Record<string, Promise<void> | undefined> = {}

export const enqueue = async <T>(uid: number, callback: () => Promise<T>): Promise<T | undefined> => {
  const instance = Editors.get(uid)
  if (!instance) {
    return undefined
  }
  const { applicationId, uri } = instance.newState
  const key = JSON.stringify([applicationId ?? null, uri || uid])
  const previous = queues[key]
  const { promise, resolve } = Promise.withResolvers<void>()
  queues[key] = promise
  if (previous) {
    await previous
  }
  try {
    return await callback()
  } finally {
    resolve()
    if (queues[key] === promise) {
      delete queues[key]
    }
  }
}
