import type { EditorState } from '../State/State.ts'
import * as EditorFolding from '../EditorFolding/EditorFolding.ts'
import { cursorSet } from '../EditorCommand/EditorCommandCursorSet.ts'

export const revealProblem = (editor: EditorState, rowIndex: number, columnIndex: number): EditorState => {
  if (!Number.isInteger(rowIndex) || !Number.isInteger(columnIndex)) {
    return editor
  }
  const row = Math.max(0, Math.min(rowIndex, editor.lines.length - 1))
  const column = Math.max(0, Math.min(columnIndex, editor.lines[row]?.length ?? 0))
  const foldingRanges = editor.foldingRanges.filter((range) => row <= range.start || row > range.end)
  const unfolded = foldingRanges.length === editor.foldingRanges.length ? editor : EditorFolding.updateLayout(editor, foldingRanges)
  return {
    ...cursorSet(unfolded, row, column),
    focused: false,
    problemsHighlightedRow: row,
  }
}
