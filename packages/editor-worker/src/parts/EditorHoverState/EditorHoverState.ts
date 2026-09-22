const state: { editor: any; timeout: any; token: number; x: number; y: number } = {
  editor: undefined,
  timeout: -1,
  token: 0,
  x: 0,
  y: 0,
}

export const get = () => {
  return state
}

export const set = (editor: any, timeout: any, x: number, y: number, token: number) => {
  state.editor = editor
  state.timeout = timeout
  state.token = token
  state.x = x
  state.y = y
}

export const clear = (editorUid?: number): void => {
  if (editorUid !== undefined && state.editor?.uid !== editorUid) {
    return
  }
  if (state.timeout !== -1) {
    clearTimeout(state.timeout)
  }
  state.editor = undefined
  state.timeout = -1
  state.token++
}
