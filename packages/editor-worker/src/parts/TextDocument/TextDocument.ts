import * as Arrays from '../Arrays/Arrays.ts'
import * as Assert from '../Assert/Assert.ts'
import * as JoinLines from '../JoinLines/JoinLines.ts'

// TODO have function for single edit (most common, avoid one array)
export const applyEdits = (textDocument: any, changes: readonly any[]): any => {
  Assert.object(textDocument)
  Assert.array(changes)
  // TODO don't copy all lines (can be expensive, e.g. 10000 lines = 10000 * 64bit = 64kB on every keystroke)
  const newLines = [...textDocument.lines]
  let linesDelta = 0
  for (const change of changes) {
    const startRowIndex = change.start.rowIndex + linesDelta
    const endRowIndex = change.end.rowIndex + linesDelta
    const startColumnIndex = change.start.columnIndex
    const endColumnIndex = change.end.columnIndex
    const { inserted } = change
    const { deleted } = change
    Assert.number(startRowIndex)
    Assert.number(endRowIndex)
    Assert.number(startColumnIndex)
    Assert.number(endColumnIndex)
    Assert.array(inserted)
    Assert.array(deleted)
    if (startRowIndex === endRowIndex) {
      if (inserted.length === 0) {
        const line = newLines[startRowIndex]
        const before = line.slice(0, startColumnIndex)
        const after = line.slice(endColumnIndex)
        newLines[startRowIndex] = before + after
      } else if (inserted.length === 1) {
        const line = newLines[startRowIndex]
        let before = line.slice(0, startColumnIndex)
        if (startColumnIndex > line.length) {
          before += ' '.repeat(startColumnIndex - line.length)
        }
        const after = line.slice(endColumnIndex)
        const text = inserted[0]
        newLines[startRowIndex] = before + text + after
      } else {
        const line = newLines[startRowIndex]
        const before = line.slice(0, startColumnIndex) + inserted[0]
        const after = inserted.at(-1) + line.slice(endColumnIndex)
        Arrays.spliceLargeArray(newLines, startRowIndex, deleted.length, [before, ...inserted.slice(1, -1), after])
        // TODO only do this once after all edits, not inside loop
        textDocument.maxLineY = Math.min(textDocument.numberOfVisibleLines, newLines.length)
      }
    } else {
      if (inserted.length === 1) {
        const before = newLines[startRowIndex].slice(0, startColumnIndex) + inserted[0]
        const after = endRowIndex >= newLines.length ? '' : newLines[endRowIndex].slice(endColumnIndex)
        Arrays.spliceLargeArray(newLines, startRowIndex, deleted.length, [before + after])
      } else {
        const before = newLines[startRowIndex].slice(0, startColumnIndex) + inserted[0]
        const middle = inserted.slice(1, -1)
        const after = inserted.at(-1) + (endRowIndex >= newLines.length ? '' : newLines[endRowIndex].slice(endColumnIndex))
        Arrays.spliceLargeArray(newLines, startRowIndex, deleted.length, [before, ...middle, after])
      }
      // TODO only do this once after all edits, not inside loop
      textDocument.maxLineY = Math.min(textDocument.numberOfVisibleLines, textDocument.lines.length)
    }
    linesDelta += inserted.length - deleted.length
  }
  return newLines
}

export const getLine = (textDocument: any, index: number) => {
  return textDocument.lines[index]
}

export const getText = (state: any) => {
  return JoinLines.joinLines(state.lines)
}

// TDOO this doesn;t belong here
export const getSelectionText = (textDocument: any, range: any) => {
  Assert.object(textDocument)
  const startRowIndex = range.start.rowIndex
  const startColumnIndex = range.start.columnIndex
  const endRowIndex = Math.min(range.end.rowIndex, textDocument.lines.length - 1)
  const endColumnIndex = range.end.columnIndex

  if (startRowIndex === endRowIndex) {
    return [textDocument.lines[startRowIndex].slice(startColumnIndex, endColumnIndex)]
  }
  const selectedLines = [
    textDocument.lines[startRowIndex].slice(startColumnIndex),
    ...textDocument.lines.slice(startRowIndex + 1, endRowIndex),
    textDocument.lines[endRowIndex].slice(0, endColumnIndex),
  ]
  return selectedLines
}

export const offsetAtSync = async (textDocument: any, positionRowIndex: any, positionColumnIndex: any) => {
  Assert.object(textDocument)
  Assert.number(positionRowIndex)
  Assert.number(positionColumnIndex)
  let offset = 0
  let rowIndex = 0
  const { lines } = textDocument
  const max = Math.min(positionRowIndex, textDocument.lines.length)
  while (rowIndex < max) {
    offset += lines[rowIndex].length + 1
    rowIndex++
  }
  offset += positionColumnIndex
  return offset
}

export const offsetAt = (textDocument: any, positionRowIndex: number, positionColumnIndex: number) => {
  Assert.object(textDocument)
  Assert.number(positionRowIndex)
  Assert.number(positionColumnIndex)
  let offset = 0
  let rowIndex = 0
  const { lines } = textDocument
  const max = Math.min(positionRowIndex, textDocument.lines.length)
  while (rowIndex < max) {
    offset += lines[rowIndex].length + 1
    rowIndex++
  }
  offset += positionColumnIndex
  return offset
}

export const positionAt = (textDocument: any, offset: number) => {
  const { lines } = textDocument
  let rowIndex = 0
  let columnIndex = 0
  let currentOffset = 0

  while (rowIndex < lines.length && currentOffset < offset) {
    currentOffset += lines[rowIndex].length + 1
    rowIndex++
  }

  if (currentOffset > offset) {
    rowIndex
    rowIndex--
    currentOffset -= lines[rowIndex].length + 1
    columnIndex = offset - currentOffset
  } else {
    columnIndex = currentOffset - offset
  }
  return {
    rowIndex,
    columnIndex,
  }
}

export * from '../GetIndent/GetIndent.ts'
