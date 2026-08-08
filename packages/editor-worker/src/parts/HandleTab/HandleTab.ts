import * as ApplyTabCompletion from '../ApplyTabCompletion/ApplyTabCompletion.ts'
import * as EditorIndentMore from '../EditorCommand/EditorCommandIndentMore.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import * as TabCompletion from '../TabCompletion/TabCompletion.ts'

export const handleTab = async (editor: any) => {
  if (!EditorSelection.isEverySelectionEmpty(editor.selections)) {
    return EditorIndentMore.indentMore(editor)
  }
  const result = await TabCompletion.getTabCompletion(editor)
  if (!result) {
    // TODO enter tab or two spaces
    return editor
  }
  return ApplyTabCompletion.applyTabCompletion(editor, result)
}
