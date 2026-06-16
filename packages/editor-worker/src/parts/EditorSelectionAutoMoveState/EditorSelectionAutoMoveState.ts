const state = {
  /**
   * @type {any}
   */
  currentEditor: undefined,
  hasListener: false,
  isSelecting: false,
  position: {
    columnIndex: 0,
    rowIndex: 0,
  },
}

// @ts-ignore
export const setEditor = (editor) => {
  state.currentEditor = editor
  state.hasListener = true
}

export const clearEditor = () => {
  state.currentEditor = undefined
  state.hasListener = false
  state.isSelecting = false
}

export const startSelecting = () => {
  state.isSelecting = true
}

export const stopSelecting = () => {
  state.isSelecting = false
}

export const isSelecting = () => {
  return state.isSelecting
}

// @ts-ignore
export const setPosition = (position) => {
  state.position = position
}

export const getEditor = () => {
  return state.currentEditor
}

export const getPosition = () => {
  return state.position
}

export const hasListener = () => {
  return state.hasListener
}
