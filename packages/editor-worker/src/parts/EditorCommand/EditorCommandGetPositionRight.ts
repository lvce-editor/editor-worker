import * as GetLineLength from '../GetLineLength/GetLineLength.ts'

export const editorGetPositionRight = (position: any, lines: string, getDelta: any) => {
  const { rowIndex } = position
  const { columnIndex } = position
  if (columnIndex >= GetLineLength.getLineLength(lines[rowIndex])) {
    if (rowIndex >= lines.length) {
      return position
    }
    return {
      columnIndex: 0,
      rowIndex: rowIndex + 1,
    }
  }
  const delta = getDelta(lines[rowIndex], columnIndex)
  return {
    columnIndex: columnIndex + delta,
    rowIndex,
  }
}

export const moveToPositionRight = (selections: any, i: number, rowIndex: number, columnIndex: number, lines: readonly string[], getDelta: any) => {
  if (rowIndex >= lines.length) {
    return
  }
  const line = lines[rowIndex]
  if (columnIndex >= GetLineLength.getLineLength(line)) {
    selections[i] = selections[i + 2] = rowIndex + 1
    selections[i + 1] = selections[i + 3] = 0
  } else {
    const delta = getDelta(line, columnIndex)
    selections[i] = selections[i + 2] = rowIndex
    selections[i + 1] = selections[i + 3] = columnIndex + delta
  }
}
