const state = {
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
