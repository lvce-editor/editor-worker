import * as ApplyTabCompletion from '../ApplyTabCompletion/ApplyTabCompletion.ts'
import * as TabCompletion from '../TabCompletion/TabCompletion.ts'

export const handleTab = async (editor: any) => {
  const result = await TabCompletion.getTabCompletion(editor)
  if (!result) {
    // TODO enter tab or two spaces
    return editor
  }
  return ApplyTabCompletion.applyTabCompletion(editor, result)
}
