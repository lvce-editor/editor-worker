import * as Editor from '../Editor/Editor.ts'
import * as Assert from '../Assert/Assert.ts'

export const applyEdit = async (editor: any, changes: any[]) => {
  Assert.object(editor)
  Assert.array(changes)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
