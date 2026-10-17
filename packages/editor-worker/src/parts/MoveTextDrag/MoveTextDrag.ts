import type { EditorState } from '../State/State.ts'
import type { TextDragData } from '../TextDragData/TextDragData.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import { getTextDragEdit } from '../GetTextDragEdit/GetTextDragEdit.ts'

interface Position {
  readonly columnIndex: number
  readonly rowIndex: number
}

export const moveTextDrag = async (editor: EditorState, data: TextDragData, target: Position): Promise<EditorState> => {
  if (data.sourceUri !== editor.uri) {
    return editor
  }
  const result = getTextDragEdit(editor, data, target, EditOrigin.EditorTextDrag)
  if (!result) {
    return editor
  }
  return Editor.scheduleDocumentAndCursorsSelections(editor, [result.change], result.selections)
}
