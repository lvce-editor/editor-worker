import * as Editors from '../EditorStates/EditorStates.ts'
import * as ExtensionHostEditor from '../ExtensionHostEditor/ExtensionHostEditor.ts'
import * as GetOffsetAtCursor from '../GetOffsetAtCursor/GetOffsetAtCursor.ts'

export const getEditorSourceActions = async (editorId?: number): Promise<readonly any[]> => {
  if (!editorId) {
    return []
  }
  const { newState } = Editors.get(editorId)
  const offset = GetOffsetAtCursor.getOffsetAtCursor(newState)
  return ExtensionHostEditor.execute({
    args: [offset],
    editor: newState,
    event: 'onLanguage',
    method: 'ExtensionHostCodeActions.getSourceActions',
  })
}
