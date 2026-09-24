export const TokenMap = {
  1: 'EdgeInvalidResultNoState',
}

export const initialLineState = {
  state: 1,
}

export const hasArrayReturn = true

export const tokenizeLine = (line) => {
  return {
    tokens: [1, line.length],
  }
}
