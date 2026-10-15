import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.ts'

export const type = async (editor: any, text: string) => {
  const changes = editorReplaceSelections(editor, SplitLines.splitLines(text), EditOrigin.EditorType)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
