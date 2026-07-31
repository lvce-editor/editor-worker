import * as Editors from '../EditorStates/EditorStates.ts'
import * as ExtensionManagementEditor from '../ExtensionManagementEditor/ExtensionManagementEditor.ts'
import * as GetOffsetAtCursor from '../GetOffsetAtCursor/GetOffsetAtCursor.ts'

export const getEditorSourceActions = async (editorId?: number): Promise<readonly any[]> => {
  if (!editorId) {
    return []
  }
  const { newState } = Editors.get(editorId)
  const offset = GetOffsetAtCursor.getOffsetAtCursor(newState)
  return ExtensionManagementEditor.execute({
    args: [offset],
    editor: newState,
    kind: 'code action',
    method: 'provideCodeActions',
    noProviderFoundResult: [],
  })
}
