import type { TabCompletionResult } from '../TabCompletionResult/TabCompletionResult.ts'
import * as EditorSnippet from '../EditorCommand/EditorCommandSnippet.ts'

export const applyTabCompletion = (editor: any, result: TabCompletionResult) => {
  return EditorSnippet.editorSnippet(editor, result)
}
