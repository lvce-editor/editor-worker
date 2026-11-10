export const TokenMap = {
  1: 'EdgeRuntimeOk',
}

export const initialLineState = {
  state: 1,
}

export const hasArrayReturn = true

export const tokenizeLine = (line, lineState) => {
  if (line.includes('throw')) {
    throw new Error('runtime tokenizer error')
  }
  return {
    state: lineState.state || 1,
    tokens: [1, line.length],
  }
}
