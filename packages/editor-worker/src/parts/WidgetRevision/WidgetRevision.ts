const revisions = new Map<number, number>()

export const next = (editorUid: number): number => {
  const revision = (revisions.get(editorUid) || 0) + 1
  revisions.set(editorUid, revision)
  return revision
}

export const get = (editorUid: number): number => {
  return revisions.get(editorUid) || 0
}

export const record = (editorUid: number, revision: number): void => {
  revisions.set(editorUid, Math.max(get(editorUid), revision))
}

export const dispose = (editorUid: number): void => {
  revisions.delete(editorUid)
}

export const reset = (): void => {
  revisions.clear()
}
