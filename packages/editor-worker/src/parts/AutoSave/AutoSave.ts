const autoSaveDelay = 1000

interface PendingSave {
  readonly timeout: ReturnType<typeof setTimeout>
  readonly token: number
}

const pendingSaves = new Map<number, PendingSave>()

const state = {
  nextToken: 0,
}

const run = async (uid: number, token: number, save: (token: number) => Promise<void>): Promise<void> => {
  if (!isLatest(uid, token)) {
    return
  }
  await save(token)
}

export const schedule = (uid: number, save: (token: number) => Promise<void>): void => {
  dispose(uid)
  const token = ++state.nextToken
  const timeout = setTimeout(run, autoSaveDelay, uid, token, save)
  pendingSaves.set(uid, { timeout, token })
}

export const isLatest = (uid: number, token: number): boolean => {
  return pendingSaves.get(uid)?.token === token
}

export const consume = (uid: number, token: number): void => {
  if (!isLatest(uid, token)) {
    return
  }
  dispose(uid)
}

export const dispose = (uid: number): void => {
  const pendingSave = pendingSaves.get(uid)
  if (!pendingSave) {
    return
  }
  clearTimeout(pendingSave.timeout)
  pendingSaves.delete(uid)
}

export const reset = (): void => {
  for (const pendingSave of pendingSaves.values()) {
    clearTimeout(pendingSave.timeout)
  }
  pendingSaves.clear()
  state.nextToken = 0
}
