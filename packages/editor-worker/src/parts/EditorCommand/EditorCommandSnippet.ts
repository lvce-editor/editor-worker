import * as Editor from '../Editor/Editor.ts'
import * as GetSnippetChanges from '../GetSnippetChanges/GetSnippetChanges.ts'

// const getIndent =
// TODO rename to insertSnippet
// TODO handle snippet tabstops and cursors $0 -> becomes cursor
export const editorSnippet = (editor: any, snippet: any) => {
  // TODO verify that deleted fits in the line
  const { lines, selections } = editor
  const { changes, selectionChanges } = GetSnippetChanges.getSnippetChanges(lines, selections, snippet)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
