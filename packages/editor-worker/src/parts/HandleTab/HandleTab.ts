import * as ApplyTabCompletion from '../ApplyTabCompletion/ApplyTabCompletion.ts'
import * as EditorIndentMore from '../EditorCommand/EditorCommandIndentMore.ts'
import * as EditorType from '../EditorCommand/EditorCommandType.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
import { getIndentString } from '../GetIndentString/GetIndentString.ts'
import * as TabCompletion from '../TabCompletion/TabCompletion.ts'

const insertTab = (editor: any) => {
  return EditorType.type(editor, getIndentString(editor))
}

export const handleTab = async (editor: any) => {
  if (!EditorSelection.isEverySelectionEmpty(editor.selections)) {
    return EditorIndentMore.indentMore(editor)
  }
  try {
    const result = await TabCompletion.getTabCompletion(editor)
    if (!result) {
      return insertTab(editor)
    }
    return ApplyTabCompletion.applyTabCompletion(editor, result)
  } catch (error) {
    await ErrorHandling.handleError(error, 'Failed to execute tab completion provider: ')
    return insertTab(editor)
  }
}
