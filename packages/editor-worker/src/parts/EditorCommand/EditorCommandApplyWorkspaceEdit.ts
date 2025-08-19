import * as Assert from '../Assert/Assert.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

// TODO maybe use a separate worker for bulk edits and bulk edit history

const getTextChanges = (editor: any, changes: readonly any[]) => {
  const textChanges: any[] = []
  for (const change of changes) {
    if (change.uri === editor.uri) {
      for (const edit of change.edits) {
        const startPosition = TextDocument.positionAt(editor, edit.offset)
        const endPosition = TextDocument.positionAt(editor, edit.offset + edit.deleted)
        const deleted = TextDocument.getSelectionText(editor, { start: startPosition, end: endPosition })
        const textChange = {
          start: startPosition,
          end: endPosition,
          inserted: [edit.inserted],
          deleted,
          origin: EditOrigin.Rename,
        }
        textChanges.push(textChange)
      }
    }
  }
  return textChanges
}

export const applyWorkspaceEdit = async (editor: any, changes: readonly any[]) => {
  Assert.object(editor)
  Assert.array(changes)
  const textChanges = getTextChanges(editor, changes)
  if (textChanges.length === 0) {
    return
  }
  // TODO
  // for now only apply edits to single file, if it matches the uri
  //
  // in the future:
  // 1. if a change targets the current editor, apply an edit to this editor
  // 2. else, use file system worker to write file change
  return Editor.scheduleDocumentAndCursorsSelections(editor, textChanges)
}
