import * as GetSourceActions from '../GetSourceActions/GetSourceActions.ts'
import type { SourceActionState } from '../SourceActionState/SourceActionState.ts'

export const loadSourceActions = async (editorUid: number, state: SourceActionState): Promise<SourceActionState> => {
  // const editor = GetEditor.getEditor(editorUid)
  // TODO request source actions information from extensions
  const sourceActions = await GetSourceActions.getEditorSourceActions()
  // TODO avoid side effect
  return {
    ...state,
    sourceActions,
    x: 200,
    y: -200,
    width: 250,
    height: 150,
    maxHeight: 150,
    focusedIndex: 0,
  }
}
