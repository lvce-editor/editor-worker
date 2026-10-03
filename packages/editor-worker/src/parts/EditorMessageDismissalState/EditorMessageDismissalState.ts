interface Dismissal {
  readonly timeout: ReturnType<typeof setTimeout>
}

const dismissals = new Map<number, Dismissal>()

export const clear = (editorUid: number): void => {
  const dismissal = dismissals.get(editorUid)
  if (!dismissal) {
    return
  }
  clearTimeout(dismissal.timeout)
  dismissals.delete(editorUid)
}

export const set = (editorUid: number, dismissal: Dismissal): void => {
  clear(editorUid)
  dismissals.set(editorUid, dismissal)
}
