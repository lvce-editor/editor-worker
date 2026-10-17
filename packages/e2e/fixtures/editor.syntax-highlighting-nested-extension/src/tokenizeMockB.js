const State = {
  TopLevelContent: 1,
  InsideMockA: 2,
}

const TokenType = {
  Tag: 1,
  Embedded: 2,
}

export const TokenMap = {
  [TokenType.Tag]: 'MockBTag',
  [TokenType.Embedded]: 'MockBEmbedded',
}

export const initialLineState = {
  state: State.TopLevelContent,
}

export const hasArrayReturn = true

export const tokenizeLine = (line, lineState) => {
  if (line === '<mock-a>') {
    return {
      state: State.InsideMockA,
      embeddedLanguage: 'mock-a',
      embeddedLanguageStart: line.length,
      embeddedLanguageEnd: line.length,
      tokens: [TokenType.Tag, line.length],
    }
  }
  if (lineState.state === State.InsideMockA) {
    return {
      state: State.InsideMockA,
      embeddedLanguage: 'mock-a',
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
