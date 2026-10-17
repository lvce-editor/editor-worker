import * as Clipboard from '../ClipBoard/ClipBoard.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as JoinLines from '../JoinLines/JoinLines.ts'
import * as EditorReplaceSelections from './EditorCommandReplaceSelection.ts'

export const cutSelectedText = async (editor: any) => {
  const changes = EditorReplaceSelections.editorReplaceSelections(editor, [''], EditOrigin.EditorCut)
  const selectedTexts = changes.map((change) => JoinLines.joinLines(change.deleted)).filter((text) => text.length > 0)
  const text = JoinLines.joinLines(selectedTexts)
  await Clipboard.writeText(text)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
