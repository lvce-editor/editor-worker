export const TokenMap = {
  1: 'EdgeNestedInner',
}

export const initialLineState = {
  state: 1,
}

export const hasArrayReturn = true

export const tokenizeLine = (line, lineState) => {
  return {
    state: lineState.state,
    tokens: [1, line.length],
  }
}
