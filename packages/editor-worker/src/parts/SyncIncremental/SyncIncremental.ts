const state = {
  enabled: false,
}

export const setEnabled = (value: boolean) => {
  state.enabled = value
}

export const getEnabled = () => {
  return state.enabled
}
