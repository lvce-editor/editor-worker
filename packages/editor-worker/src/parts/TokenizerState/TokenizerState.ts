const state = {
  /**
   * @type {number[]}
   */
  connectedEditors: [],
  listeners: [],
  pending: Object.create(null),
  tokenizePaths: Object.create(null),
  tokenizers: Object.create(null),
}

export const has = (languageId: any) => {
  return Object.hasOwn(state.tokenizers, languageId)
}

export const set = (languageId: any, tokenizer: any) => {
  state.tokenizers[languageId] = tokenizer
}

export const get = (languageId: any) => {
  return state.tokenizers[languageId]
}

export const setTokenizePath = (languageId: any, tokenizePath: string) => {
  state.tokenizePaths[languageId] = tokenizePath
}

export const getTokenizePath = (languageId: any) => {
  return state.tokenizePaths[languageId] || ''
}

export const setTokenizePaths = (languages: readonly any[]) => {
  for (const language of languages) {
    if (language && language.id && language.tokenize) {
      setTokenizePath(language.id, language.tokenize)
    }
  }
}

export const isPending = (languageId: any) => {
  return Object.hasOwn(state.pending, languageId)
}
