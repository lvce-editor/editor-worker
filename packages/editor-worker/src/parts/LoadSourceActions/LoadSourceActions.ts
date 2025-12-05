import type { SourceActionState } from '../SourceActionState/SourceActionState.ts'
import * as GetSourceActions from '../GetSourceActions/GetSourceActions.ts'
import * as GetSourceActionWidgetPosition from '../GetSourceActionWidgetPosition/GetSourceActionWidgetPosition.ts'

export const loadSourceActions = async (editor: any, state: SourceActionState): Promise<SourceActionState> => {
  // const editor = GetEditor.getEditor(editorUid)
  // TODO request source actions information from extensions
  const sourceActions = await GetSourceActions.getEditorSourceActions()
  // TODO avoid side effect
  const { height, width, x, y } = GetSourceActionWidgetPosition.getSourceActionWidgetPosition(editor, sourceActions.length)
  return {
    ...state,
    focusedIndex: 0,
    height,
    maxHeight: 150,
    sourceActions,
    width,
    x,
    y,
  }
}
