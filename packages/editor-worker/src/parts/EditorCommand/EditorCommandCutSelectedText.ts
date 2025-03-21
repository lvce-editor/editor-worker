import * as ClipBoard from '../ClipBoard/ClipBoard.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as JoinLines from '../JoinLines/JoinLines.ts'
import * as EditorReplaceSelections from './EditorCommandReplaceSelection.ts'

export const cutSelectedText = async (editor: any) => {
  const { selections } = editor
  const [startRowIndex, startColumnIndex, endRowIndex, endColumnIndex] = selections
  const changes = EditorReplaceSelections.editorReplaceSelections(editor, [''], EditOrigin.EditorCut)
  const selectionChanges = new Uint32Array([startRowIndex, startColumnIndex, endRowIndex, endColumnIndex])
  // @ts-ignore
  const text = JoinLines.joinLines(changes[0].deleted)
  // TODO remove selected text from document
  await ClipBoard.writeText(text)
  // @ts-ignore
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
