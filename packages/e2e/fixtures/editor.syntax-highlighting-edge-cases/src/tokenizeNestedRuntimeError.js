export const TokenMap = {
  1: 'EdgeNestedRuntimeOuter',
}

const State = {
  TopLevelContent: 1,
  InsideRuntime: 2,
}

export const initialLineState = {
  state: State.TopLevelContent,
}

export const hasArrayReturn = true

export const tokenizeLine = (line, lineState) => {
  if (line === '<runtime>') {
    return {
      state: State.InsideRuntime,
      embeddedLanguage: 'sh-runtime-error',
      embeddedLanguageStart: line.length,
      embeddedLanguageEnd: line.length,
      tokens: [1, line.length],
    }
  }
  if (lineState.state === State.InsideRuntime) {
    return {
      state: State.InsideRuntime,
      embeddedLanguage: 'sh-runtime-error',
      embeddedLanguageStart: 0,
      embeddedLanguageEnd: line.length,
      tokens: [1, line.length],
    }
  }
  return {
    state: lineState.state,
    tokens: [1, line.length],
  }
}
