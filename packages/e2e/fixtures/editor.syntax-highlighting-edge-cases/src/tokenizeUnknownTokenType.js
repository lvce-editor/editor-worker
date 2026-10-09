export const TokenMap = {
  1: 'EdgeKnownToken',
}

export const initialLineState = {
  state: 1,
}

export const hasArrayReturn = true

export const tokenizeLine = (line, lineState) => {
  return {
    state: lineState.state,
    tokens: [99, line.length],
  }
}
