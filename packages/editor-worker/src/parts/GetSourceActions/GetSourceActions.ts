import * as Editors from '../EditorStates/EditorStates.ts'
import * as ExtensionHostEditor from '../ExtensionHostEditor/ExtensionHostEditor.ts'

export const getEditorSourceActions = async (editorId?: number): Promise<readonly any[]> => {
  if (!editorId) {
    return []
  }
  const { newState } = Editors.get(editorId)
  return ExtensionHostEditor.execute({
    args: [],
    editor: newState,
    event: 'onLanguage',
    method: 'ExtensionHostCodeActions.getSourceActions',
  })
}
