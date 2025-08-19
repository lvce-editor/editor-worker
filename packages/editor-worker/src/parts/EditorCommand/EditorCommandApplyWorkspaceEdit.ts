import * as Assert from '../Assert/Assert.ts'
import * as Editor from '../Editor/Editor.ts'

// TODO maybe use a separate worker for bulk edits and bulk edit history

export const applyWorkspaceEdit = async (editor: any, changes: readonly any[]) => {
  Assert.object(editor)
  Assert.array(changes)
  // TODO
  // 1. if a change targets the current editor, apply an edit to this editor
  // 2. else, use file system worker to write file change
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
