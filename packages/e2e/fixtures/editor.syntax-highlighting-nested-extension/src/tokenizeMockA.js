const State = {
  TopLevelContent: 1,
}

const TokenType = {
  Identifier: 1,
}

export const TokenMap = {
  [TokenType.Identifier]: 'MockAIdentifier',
}

export const initialLineState = {
  state: State.TopLevelContent,
}

export const hasArrayReturn = true

export const tokenizeLine = (line, lineState) => {
  return {
    state: lineState.state,
    tokens: [TokenType.Identifier, line.length],
  }
}
