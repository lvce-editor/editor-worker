import * as GetSourceActions from '../GetSourceActions/GetSourceActions.ts'
import * as GetSourceActionWidgetPosition from '../GetSourceActionWidgetPosition/GetSourceActionWidgetPosition.ts'
import type { SourceActionState } from '../SourceActionState/SourceActionState.ts'

export const loadSourceActions = async (editor: any, state: SourceActionState): Promise<SourceActionState> => {
  // const editor = GetEditor.getEditor(editorUid)
  // TODO request source actions information from extensions
  const sourceActions = await GetSourceActions.getEditorSourceActions()
  // TODO avoid side effect
  const { x, y, width, height } = GetSourceActionWidgetPosition.getSourceActionWidgetPosition(editor)
  return {
    ...state,
    sourceActions,
    x,
    y,
    width,
    height,
    maxHeight: 150,
    focusedIndex: 0,
  }
}
