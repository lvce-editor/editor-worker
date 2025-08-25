export const languageId = 'typescript'

const organizeImports = {
  kind: 'source.organizeImports', // TODO use numeric code action type
  name: 'Organize Imports',
  async execute(textDocument) {
    // TODO
    return []
  },
}

/**
 */
export const provideCodeActions = async () => {
  return [organizeImports]
}
