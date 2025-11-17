import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.ts'

export const type = async (editor: any, text: string) => {
  const changes = editorReplaceSelections(editor, [text], EditOrigin.EditorType)
  const newEditor = await Editor.scheduleDocumentAndCursorsSelections(editor, changes)
  if (newEditor.completionsOnType) {
    // TODO open it if it is not visible
  }
  return newEditor
}
