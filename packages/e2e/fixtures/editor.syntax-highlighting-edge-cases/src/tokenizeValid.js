const TokenType = {
  Keyword: 1,
  Identifier: 2,
  Text: 3,
}

export const TokenMap = {
  [TokenType.Keyword]: 'EdgeKeyword',
  [TokenType.Identifier]: 'EdgeIdentifier',
  [TokenType.Text]: 'EdgeText',
}

export const initialLineState = {
  state: 1,
}

export const hasArrayReturn = true

export const tokenizeLine = (line, lineState) => {
  if (line.startsWith('keyword ')) {
    return {
      state: lineState.state,
      tokens: [TokenType.Keyword, 7, TokenType.Identifier, line.length - 7],
    }
  }
  return {
    state: lineState.state,
    tokens: [TokenType.Text, line.length],
  }
}
