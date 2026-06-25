const State = {
  TopLevelContent: 1,
  InsideMiddle: 2,
}

export const TokenMap = {
  1: 'EdgeNestedOuterTag',
  2: 'EdgeNestedOuterText',
}

export const initialLineState = {
  state: State.TopLevelContent,
}

export const hasArrayReturn = true

export const tokenizeLine = (line, lineState) => {
  if (line === '<middle>') {
    return {
      state: State.InsideMiddle,
      embeddedLanguage: 'sh-nested-middle',
      embeddedLanguageStart: line.length,
      embeddedLanguageEnd: line.length,
      tokens: [1, line.length],
    }
  }
  if (line === 'reset') {
    return {
      state: State.TopLevelContent,
      tokens: [2, line.length],
    }
  }
  if (lineState.state === State.InsideMiddle) {
    return {
      state: State.InsideMiddle,
      embeddedLanguage: 'sh-nested-middle',
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
