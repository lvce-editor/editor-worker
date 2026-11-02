import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'

const getChanges = (editor: any) => {
  const { lines, selections } = editor
  const changes: any[] = []
  const rowsToIndentLess = new Set<number>()
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionEndRow = selections[i + 2]
    for (let i = selectionStartRow; i <= selectionEndRow; i++) {
      rowsToIndentLess.add(i)
    }
  }
  for (const rowToIndent of rowsToIndentLess) {
    const line = lines[rowToIndent]
    const leadingWhitespace = line.match(/^[\t ]+/)?.[0] ?? ''
    const whitespaceToRemove = leadingWhitespace.startsWith('\t') ? '\t' : leadingWhitespace.slice(0, editor.tabSize || 2)
    if (!whitespaceToRemove) {
      continue
    }
    changes.push({
      deleted: [whitespaceToRemove],
      end: {
        columnIndex: whitespaceToRemove.length,
        rowIndex: rowToIndent,
      },
      inserted: [''],
      origin: EditOrigin.IndentLess,
      start: {
        columnIndex: 0,
        rowIndex: rowToIndent,
      },
    })
  }
  return changes
}

// @ts-ignore
export const indentLess = (editor) => {
  const changes = getChanges(editor)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
