import * as Assert from '../Assert/Assert.ts'
import * as Editor from '../Editor/Editor.ts'

export const applyEdit = async (editor: any, changes: readonly any[]) => {
  Assert.object(editor)
  Assert.array(changes)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
