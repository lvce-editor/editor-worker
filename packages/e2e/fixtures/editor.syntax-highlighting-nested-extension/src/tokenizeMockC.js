const State = {
  TopLevelContent: 1,
  InsideMockB: 2,
}

const TokenType = {
  Tag: 1,
  Embedded: 2,
}

export const TokenMap = {
  [TokenType.Tag]: 'MockCTag',
  [TokenType.Embedded]: 'MockCEmbedded',
}

export const initialLineState = {
  state: State.TopLevelContent,
}

export const hasArrayReturn = true

export const tokenizeLine = (line, lineState) => {
  if (line === '<mock-b>') {
    return {
      state: State.InsideMockB,
      embeddedLanguage: 'mock-b',
      embeddedLanguageStart: line.length,
      embeddedLanguageEnd: line.length,
      tokens: [TokenType.Tag, line.length],
    }
  }
  if (lineState.state === State.InsideMockB) {
    return {
      state: State.InsideMockB,
      embeddedLanguage: 'mock-b',
      embeddedLanguageStart: 0,
      embeddedLanguageEnd: line.length,
      tokens: [TokenType.Embedded, line.length],
    }
  }
  return {
    state: lineState.state,
    tokens: [TokenType.Embedded, line.length],
  }
}
