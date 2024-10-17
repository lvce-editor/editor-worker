import * as EditorStrings from '../EditorStrings/EditorStrings.ts'

export const getEditorSourceActions = async () => {
  const sourceActions = [
    {
      name: EditorStrings.organizeImports(),
      command: 'Editor.organizeImports',
    },
    {
      name: EditorStrings.sortImports(),
      command: 'Editor.sortImports',
    },
  ]
  return sourceActions
}
