import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
import * as GetX from '../GetX/GetX.ts'
import * as GetY from '../GetY/GetY.ts'
import * as Px from '../Px/Px.ts'

export const fromRange = (startRowIndex: number, startColumnIndex: number, endRowIndex: number, endColumnIndex: number) => {
  return new Uint32Array([startRowIndex, startColumnIndex, endRowIndex, endColumnIndex])
}

export const fromRanges = (...items: any[]) => {
  return new Uint32Array(items.flat())
}

export const alloc = (length: number) => {
  return new Uint32Array(length)
}

export const clone = (selections: any[]) => {
  return alloc(selections.length)
}

export const map = (selections: any[], fn: any) => {
  const newSelections = clone(selections)
  for (let i = 0; i < newSelections.length; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(selections, i)
    fn(newSelections, i, selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn)
  }
  return newSelections
}

export const forEach = (selections: any[], fn: any) => {
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    fn(selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn)
  }
}

export const moveRangeToPosition = (selections: any[] | Uint32Array, i: number, rowIndex: number, columnIndex: number) => {
  selections[i] = selections[i + 2] = rowIndex
  selections[i + 1] = selections[i + 3] = columnIndex
}

export const isEmpty = (selectionStartRow: number, selectionStartColumn: number, selectionEndRow: number, selectionEndColumn: number) => {
  return selectionStartRow === selectionEndRow && selectionStartColumn === selectionEndColumn
}

const isSelectionSingleLine = (selectionStartRow: number, selectionStartColumn: number, selectionEndRow: number, selectionEndColumn: number) => {
  return selectionStartRow === selectionEndRow
}

const isEverySelection = (selections: any[], fn: any) => {
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    if (!fn(selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn)) {
      return false
    }
  }
  return true
}

export const isEverySelectionEmpty = (selections: any[]) => {
  return isEverySelection(selections, isEmpty)
}

export const isEverySelectionSingleLine = (selections: any[]) => {
  return isEverySelection(selections, isSelectionSingleLine)
}

export const from = (array: any[], getSelection: any) => {
  const newSelections = alloc(array.length * 4)
  let i = 0
  for (const item of array) {
    const { end, start } = getSelection(item)
    newSelections[i++] = start.rowIndex
    newSelections[i++] = start.columnIndex
    newSelections[i++] = end.rowIndex
    newSelections[i++] = end.columnIndex
  }
  return newSelections
}

export const push = (
  selections: any[] | Uint32Array,
  startRowIndex: number,
  startColumnIndex: number,
  endRowIndex: number,
  endColumnIndex: number,
) => {
  const oldLength = selections.length
  const newSelections = alloc(oldLength + 4)
  newSelections.set(selections)
  newSelections[oldLength + 1] = startRowIndex
  newSelections[oldLength + 2] = startColumnIndex
  newSelections[oldLength + 3] = endRowIndex
  newSelections[oldLength + 4] = endColumnIndex
  return newSelections
}

// TODO maybe only accept sorted selection edits in the first place

const emptyCursors: any[] = []

const getCursorArray = (visibleCursors: any, isFocused: any) => {
  if (!isFocused) {
    return emptyCursors
  }
  const cursorArray = []
  for (let i = 0; i < visibleCursors.length; i += 2) {
    const x = visibleCursors[i]
    const y = visibleCursors[i + 1]
    cursorArray.push(`${Px.px(x)} ${Px.px(y)}`)
  }
  return cursorArray
}

const getSelectionArray = (visibleSelections: any) => {
  const selectionsArray = []
  for (let i = 0; i < visibleSelections.length; i += 4) {
    const x = visibleSelections[i]
    const y = visibleSelections[i + 1]
    const width = visibleSelections[i + 2]
    const height = visibleSelections[i + 3]
    selectionsArray.push(Px.px(x), Px.px(y), Px.px(width), Px.px(height))
  }
  return selectionsArray
}

const getLineX = async (
  line: string,
  columnIndex: number,
  fontWeight: any,
  fontSize: any,
  fontFamily: any,
  isMonospaceFont: any,
  letterSpacing: any,
  tabSize: any,
  halfCursorWidth: any,
  width: any,
  averageCharWidth: any,
  difference: any,
) => {
  return GetX.getX(
    line,
    columnIndex,
    fontWeight,
    fontSize,
    fontFamily,
    isMonospaceFont,
    letterSpacing,
    tabSize,
    halfCursorWidth,
    width,
    averageCharWidth,
    difference,
  )
}

const pushSingleLineSelection = async (
  visibleCursors: number[],
  visibleSelections: number[],
  reversed: boolean,
  endLine: string,
  endLineEndX: number,
  endLineY: number,
  selectionStartColumn: number,
  startLineY: number,
  fontWeight: any,
  fontSize: any,
  fontFamily: any,
  isMonospaceFont: any,
  letterSpacing: any,
  tabSize: any,
  halfCursorWidth: any,
  width: any,
  averageCharWidth: any,
  difference: any,
  rowHeight: number,
) => {
  const startX = await getLineX(
    endLine,
    selectionStartColumn,
    fontWeight,
    fontSize,
    fontFamily,
    isMonospaceFont,
    letterSpacing,
    tabSize,
    halfCursorWidth,
    width,
    averageCharWidth,
    difference,
  )
  visibleCursors.push(reversed ? startX : endLineEndX, endLineY)
  visibleSelections.push(startX, startLineY, endLineEndX - startX, rowHeight)
}

const pushStartLineSelection = async (
  visibleCursors: number[],
  visibleSelections: number[],
  reversed: boolean,
  lines: string[],
  selectionStartRow: number,
  selectionStartColumn: number,
  minLineY: number,
  rowHeight: number,
  fontWeight: any,
  fontSize: any,
  fontFamily: any,
  isMonospaceFont: any,
  letterSpacing: any,
  tabSize: any,
  halfCursorWidth: any,
  width: any,
  averageCharWidth: any,
  difference: any,
) => {
  const startLine = lines[selectionStartRow]
  const startLineStartX = await getLineX(
    startLine,
    selectionStartColumn,
    fontWeight,
    fontSize,
    fontFamily,
    isMonospaceFont,
    letterSpacing,
    tabSize,
    halfCursorWidth,
    width,
    averageCharWidth,
    difference,
  )
  const startLineEndX = await getLineX(
    startLine,
    startLine.length,
    fontWeight,
    fontSize,
    fontFamily,
    isMonospaceFont,
    letterSpacing,
    tabSize,
    halfCursorWidth,
    width,
    averageCharWidth,
    difference,
  )
  const startLineY = GetY.getY(selectionStartRow, minLineY, rowHeight)
  if (reversed) {
    visibleCursors.push(startLineStartX, startLineY)
  }
  visibleSelections.push(startLineStartX, startLineY, startLineEndX - startLineStartX, rowHeight)
}

const pushMiddleLineSelections = async (
  visibleSelections: number[],
  lines: string[],
  iMin: number,
  iMax: number,
  minLineY: number,
  rowHeight: number,
  differences: any,
  fontWeight: any,
  fontSize: any,
  fontFamily: any,
  isMonospaceFont: any,
  letterSpacing: any,
  tabSize: any,
  halfCursorWidth: any,
  width: any,
  averageCharWidth: any,
) => {
  for (let i = iMin; i < iMax; i++) {
    const currentLine = lines[i]
    const currentLineY = GetY.getY(i, minLineY, rowHeight)
    const difference = differences[i - minLineY]
    const selectionWidth = await getLineX(
      currentLine,
      currentLine.length,
      fontWeight,
      fontSize,
      fontFamily,
      isMonospaceFont,
      letterSpacing,
      tabSize,
      halfCursorWidth,
      width,
      averageCharWidth,
      difference,
    )
    visibleSelections.push(0, currentLineY, selectionWidth, rowHeight)
  }
}

const pushEndLineSelection = (
  visibleCursors: number[],
  visibleSelections: number[],
  reversed: boolean,
  selectionEndRow: number,
  maxLineY: number,
  endLineEndX: number,
  endLineY: number,
  rowHeight: number,
) => {
  if (selectionEndRow > maxLineY) {
    return
  }
  visibleSelections.push(0, endLineY, endLineEndX, rowHeight)
  if (!reversed) {
    visibleCursors.push(endLineEndX, endLineY)
  }
}

export const getVisible = async (editor: any) => {
  const visibleCursors = []
  const visibleSelections = []
  // // TODO binary search

  const {
    charWidth,
    cursorWidth,
    differences,
    focused,
    fontFamily,
    fontSize,
    fontWeight,
    isMonospaceFont,
    letterSpacing,
    lines,
    maxLineY,
    minLineY,
    rowHeight,
    selections,
    tabSize,
    width,
  } = editor

  const averageCharWidth = charWidth
  const halfCursorWidth = cursorWidth / 2
  for (let i = 0; i < selections.length; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn, reversed] = GetSelectionPairs.getSelectionPairs(
      selections,
      i,
    )
    if (selectionEndRow < minLineY || selectionStartRow > maxLineY) {
      continue
    }
    const relativeEndLineRow = selectionEndRow - minLineY
    const endLineDifference = differences[relativeEndLineRow]
    const endLine = lines[selectionEndRow]
    const endLineEndX = await GetX.getX(
      endLine,
      selectionEndColumn,
      fontWeight,
      fontSize,
      fontFamily,
      isMonospaceFont,
      letterSpacing,
      tabSize,
      halfCursorWidth,
      width,
      averageCharWidth,
      endLineDifference,
    )
    const endLineY = GetY.getY(selectionEndRow, minLineY, rowHeight)
    if (isEmpty(selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn) && endLineEndX > 0) {
      visibleCursors.push(endLineEndX, endLineY)
      continue
    }
    const startLineY = GetY.getY(selectionStartRow, minLineY, rowHeight)
    const startLineYRelative = selectionStartRow - minLineY
    const startLineDifference = differences[startLineYRelative]
    if (selectionStartRow === selectionEndRow) {
      await pushSingleLineSelection(
        visibleCursors,
        visibleSelections,
        reversed,
        endLine,
        endLineEndX,
        endLineY,
        selectionStartColumn,
        startLineY,
        fontWeight,
        fontSize,
        fontFamily,
        isMonospaceFont,
        letterSpacing,
        tabSize,
        halfCursorWidth,
        width,
        averageCharWidth,
        startLineDifference,
        rowHeight,
      )
    } else {
      if (selectionStartRow >= minLineY) {
        await pushStartLineSelection(
          visibleCursors,
          visibleSelections,
          reversed,
          lines,
          selectionStartRow,
          selectionStartColumn,
          minLineY,
          rowHeight,
          fontWeight,
          fontSize,
          fontFamily,
          isMonospaceFont,
          letterSpacing,
          tabSize,
          halfCursorWidth,
          width,
          averageCharWidth,
          startLineDifference,
        )
      }
      const iMin = Math.max(selectionStartRow + 1, minLineY)
      const iMax = Math.min(selectionEndRow, maxLineY)
      await pushMiddleLineSelections(
        visibleSelections,
        lines,
        iMin,
        iMax,
        minLineY,
        rowHeight,
        differences,
        fontWeight,
        fontSize,
        fontFamily,
        isMonospaceFont,
        letterSpacing,
        tabSize,
        halfCursorWidth,
        width,
        averageCharWidth,
      )
      pushEndLineSelection(visibleCursors, visibleSelections, reversed, selectionEndRow, maxLineY, endLineEndX, endLineY, rowHeight)
    }
  }
  // TODO maybe use Uint32array or Float64Array?
  return {
    cursorInfos: getCursorArray(visibleCursors, focused),
    selectionInfos: getSelectionArray(visibleSelections),
  }
}
