import * as ExtensionHostTabCompletion from '../ExtensionHostTabCompletion/ExtensionHostTabCompletion.ts'
import * as GetOffsetAtCursor from '../GetOffsetAtCursor/GetOffsetAtCursor.ts'

export const getTabCompletion = async (editor: any) => {
  const offset = GetOffsetAtCursor.getOffsetAtCursor(editor)
  const completions = await ExtensionHostTabCompletion.executeTabCompletionProvider(editor, offset)
  return completions
}
