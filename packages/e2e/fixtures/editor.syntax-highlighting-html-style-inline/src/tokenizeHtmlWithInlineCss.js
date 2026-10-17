export const TokenMap = {
  1: 'Html',
}

export const hasArrayReturn = true

export const initialLineState = {
  state: 1,
}

export const tokenizeLine = (line) => {
  const openingTagEnd = line.indexOf('>')
  const embeddedLanguageStart = openingTagEnd === -1 ? 0 : openingTagEnd + 1
  const embeddedLanguageEnd = line.indexOf('</style>', embeddedLanguageStart)
  const hasEmbeddedCss = openingTagEnd !== -1 && embeddedLanguageEnd !== -1
  return {
    embeddedLanguage: hasEmbeddedCss ? 'css' : '',
    embeddedLanguageEnd: hasEmbeddedCss ? embeddedLanguageEnd : 0,
    embeddedLanguageStart: hasEmbeddedCss ? embeddedLanguageStart : 0,
    state: 1,
    tokens: [1, line.length],
  }
}
