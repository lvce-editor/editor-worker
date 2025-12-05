const state = {
  position: {
    columnIndex: 0,
    rowIndex: 0,
  },
}

export const getPosition = () => {
  return state.position
}

// @ts-ignore
export const setPosition = (position) => {
  state.position = position
}
