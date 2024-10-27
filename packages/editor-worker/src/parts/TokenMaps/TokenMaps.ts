const tokenMaps = Object.create(null)

export const set = (languageId: string, tokenMap: any) => {
  tokenMaps[languageId] = tokenMap
}

export const get = (languageId: string) => {
  return tokenMaps[languageId] || {}
}
