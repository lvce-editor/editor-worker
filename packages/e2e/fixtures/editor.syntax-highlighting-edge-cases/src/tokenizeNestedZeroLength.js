export const TokenMap = {
  1: 'EdgeNestedZeroOuter',
}

export const initialLineState = {
  state: 1,
}

export const hasArrayReturn = true

export const tokenizeLine = (line, lineState) => {
  return {
    state: lineState.state,
    embeddedLanguage: 'sh-valid',
    embeddedLanguageStart: 0,
    embeddedLanguageEnd: 0,
    tokens: [1, line.length],
  }
}
