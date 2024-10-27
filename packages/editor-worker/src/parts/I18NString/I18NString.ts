const emptyObject = {}

const RE_PLACEHOLDER = /\{(PH\d+)\}/g

export const i18nString = (key: string, placeholders: any = emptyObject) => {
  if (placeholders === emptyObject) {
    return key
  }
  const replacer = (match: any, rest: string) => {
    return placeholders[rest]
  }
  return key.replaceAll(RE_PLACEHOLDER, replacer)
}
