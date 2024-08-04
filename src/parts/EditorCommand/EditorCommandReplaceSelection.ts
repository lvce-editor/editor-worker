import * as EditorCommandReplaceRange from './EditorCommandReplaceRange.ts'

export const editorReplaceSelections = (editor: any, replacement: any, origin: any) => {
  const { selections } = editor
  return EditorCommandReplaceRange.replaceRange(editor, selections, replacement, origin)
}
