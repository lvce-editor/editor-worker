import * as DefinitionLinkDecoration from '../DefinitionLinkDecoration/DefinitionLinkDecoration.ts'

const altKey = 'Alt'

export const handleKeyUp = (editor: any, key: string): any => {
  if (key !== altKey) {
    return editor
  }
  return DefinitionLinkDecoration.clear(editor)
}
