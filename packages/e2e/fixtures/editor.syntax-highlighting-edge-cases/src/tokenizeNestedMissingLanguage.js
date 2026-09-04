export const TokenMap = {
  1: 'EdgeNestedOuter',
}

export const initialLineState = {
  state: 1,
}

export const hasArrayReturn = true

export const tokenizeLine = (line, lineState) => {
  return {
    state: lineState.state,
    embeddedLanguage: 'sh-does-not-exist',
    embeddedLanguageStart: 0,
    embeddedLanguageEnd: line.length,
    tokens: [1, line.length],
  }
}
