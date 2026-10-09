export const TokenMap = {
  1: 'EdgeEmptyToken',
}

export const initialLineState = {
  state: 1,
}

export const hasArrayReturn = true

export const tokenizeLine = (line, lineState) => {
  return {
    state: lineState.state || 1,
    tokens: [],
  }
}
