import type { EditorStatus } from '../EditorStatus/EditorStatus.ts'
import type { EditorState } from '../State/State.ts'

const getOffset = (lines: readonly string[], rowIndex: number, columnIndex: number): number => {
  let offset = columnIndex
  for (let i = 0; i < rowIndex; i++) {
    offset += lines[i].length + 1
  }
  return offset
}

const getSelectedChars = (editor: EditorState): number => {
  const { lines, selections } = editor
  let selectedChars = 0
  for (let i = 0; i < selections.length; i += 4) {
    const startOffset = getOffset(lines, selections[i], selections[i + 1])
    const endOffset = getOffset(lines, selections[i + 2], selections[i + 3])
    selectedChars += Math.abs(endOffset - startOffset)
  }
  return selectedChars
}

export const getEditorStatus = (editor: EditorState): EditorStatus => {
  const primarySelectionIndex = editor.primarySelectionIndex || 0
  const rowIndex = editor.selections[primarySelectionIndex + 2] || 0
  const columnIndex = editor.selections[primarySelectionIndex + 3] || 0
  return {
    column: columnIndex + 1,
    encoding: 'utf8',
    endOfLine: editor.endOfLine,
    insertSpaces: editor.insertSpaces,
    languageId: editor.languageId,
    line: rowIndex + 1,
    selectedChars: getSelectedChars(editor),
    tabSize: editor.tabSize,
  }
}
