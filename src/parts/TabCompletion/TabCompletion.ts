import * as ExtensionHostTabCompletion from '../ExtensionHostTabCompletion/ExtensionHostTabCompletion.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const getTabCompletion = async (editor: any) => {
  const { selections } = editor
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  // Editor.sync(editor)
  const offset = await TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const completions = await ExtensionHostTabCompletion.executeTabCompletionProvider(editor, offset)
  return completions
}
