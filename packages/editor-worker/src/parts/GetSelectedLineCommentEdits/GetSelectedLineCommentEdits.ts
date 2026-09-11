import type { Edit } from '../Edit/Edit.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import { getLineCommentEdit } from '../GetLineCommentEdit/GetLineCommentEdit.ts'

export const getSelectedLineCommentEdits = (editor: any, lineComment: string): readonly Edit[] => {
  const { lines, selections } = editor
  const selectedRows = new Set<number>()
  for (let i = 0; i < selections.length; i += 4) {
    const startRow = Math.min(selections[i], selections[i + 2])
    let endRow = Math.max(selections[i], selections[i + 2])
    const endColumn = selections[i + (selections[i] > selections[i + 2] ? 1 : 3)]
    if (endRow > startRow && endColumn === 0) {
      endRow--
    }
    for (let row = startRow; row <= endRow; row++) {
      if (lines[row].trim()) {
        selectedRows.add(row)
      }
    }
  }
  const rows = [...selectedRows].toSorted((a, b) => a - b)
  const remove = rows.every((row) => lines[row].trimStart().startsWith(lineComment))
  return rows.map((rowIndex): Edit => {
    const line = lines[rowIndex]
    if (remove) {
      return getLineCommentEdit(rowIndex, line, lineComment)
    }
    const columnIndex = line.length - line.trimStart().length
    return {
      deleted: [''],
      end: { columnIndex, rowIndex },
      inserted: [`${lineComment} `],
      origin: EditOrigin.ToggleBlockComment,
      start: { columnIndex, rowIndex },
    }
  })
}
