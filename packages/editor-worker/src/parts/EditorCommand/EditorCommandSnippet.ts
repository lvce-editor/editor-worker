import * as Editor from '../Editor/Editor.ts'
import * as GetSnippetChanges from '../GetSnippetChanges/GetSnippetChanges.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

// const getIndent =
// TODO rename to insertSnippet
// TODO handle snippet tabstops and cursors $0 -> becomes cursor
export const editorSnippet = async (editor: any, snippet: any) => {
  // TODO verify that deleted fits in the line
  const { lines, selections } = editor
  const { changes, selectionChanges, tabStops } = GetSnippetChanges.getSnippetChanges(lines, selections, snippet)
  const newEditor = await Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
  if (selections.length !== 4 || tabStops.length < 2) {
    return newEditor
  }
  const initialStop =
    tabStops.find((stop: any) => stop.index === 0) ??
    tabStops.filter((stop: any) => stop.index > 0).toSorted((a: any, b: any) => a.index - b.index)[0]
  const remainingStops = tabStops
    .filter((stop: any) => stop !== initialStop && stop.index > 0)
    .toSorted((a: any, b: any) => a.index - b.index)
    .map((stop: any) => ({
      offset: TextDocument.offsetAt(newEditor, stop.rowIndex, stop.columnIndex),
    }))
  if (remainingStops.length === 0) {
    return newEditor
  }
  return {
    ...newEditor,
    snippetTabStops: {
      activeOffset: TextDocument.offsetAt(newEditor, initialStop.rowIndex, initialStop.columnIndex),
      stops: remainingStops,
    },
  }
}
