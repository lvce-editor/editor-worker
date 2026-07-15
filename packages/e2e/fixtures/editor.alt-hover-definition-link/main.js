const getWordAtOffset = (text, offset) => {
  const before = text.slice(0, offset).match(/[\w-]+$/)?.[0] || ''
  const after = text.slice(offset).match(/^[\w-]+/)?.[0] || ''
  return before + after
}

const provider = {
  languageId: 'definition-link-test',
  provideDefinition(textDocument, offset) {
    if (getWordAtOffset(textDocument.text, offset) === 'missing') {
      return undefined
    }
    const definitionOffset = Math.max(textDocument.text.indexOf('definition'), 0)
    return {
      endOffset: definitionOffset + 'definition'.length,
      startOffset: definitionOffset,
      uri: textDocument.uri,
    }
  },
}

export const activate = () => {
  vscode.registerDefinitionProvider(provider)
}
