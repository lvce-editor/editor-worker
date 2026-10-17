const State = {
  TopLevelContent: 1,
  InsideInner: 2,
}

export const TokenMap = {
  1: 'EdgeNestedMiddleTag',
  2: 'EdgeNestedMiddleText',
}

export const initialLineState = {
  state: State.TopLevelContent,
}

export const hasArrayReturn = true

export const tokenizeLine = (line, lineState) => {
  if (line === '<inner>') {
    return {
      state: State.InsideInner,
      embeddedLanguage: 'sh-nested-inner',
      embeddedLanguageStart: line.length,
      embeddedLanguageEnd: line.length,
      tokens: [1, line.length],
    }
  }
  if (lineState.state === State.InsideInner) {
    return {
      state: State.InsideInner,
      embeddedLanguage: 'sh-nested-inner',
      embeddedLanguageStart: 0,
      embeddedLanguageEnd: line.length,
      tokens: [2, line.length],
    }
  }
  return {
    state: State.TopLevelContent,
    tokens: [2, line.length],
  }
}
