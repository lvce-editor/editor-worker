export const TokenMap = {
  1: 'EdgeNestedPartialOuter',
  2: 'EdgeNestedPartialMarker',
}

export const initialLineState = {
  state: 1,
}

export const hasArrayReturn = true

export const tokenizeLine = (line, lineState) => {
  return {
    state: lineState.state,
    embeddedLanguage: 'sh-nested-inner',
    embeddedLanguageStart: 5,
    embeddedLanguageEnd: 10,
    tokens: [1, 5, 2, 5, 1, line.length - 10],
  }
}
