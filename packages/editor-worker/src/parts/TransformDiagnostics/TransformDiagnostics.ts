import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'

interface Position {
  readonly columnIndex: number
  readonly rowIndex: number
}

const comparePositions = (left: Position, right: Position): number => left.rowIndex - right.rowIndex || left.columnIndex - right.columnIndex

const getInsertedEnd = (start: Position, inserted: readonly string[]): Position => {
  if (inserted.length === 1) {
    return {
      columnIndex: start.columnIndex + inserted[0].length,
      rowIndex: start.rowIndex,
    }
  }
  return {
    columnIndex: inserted.at(-1)!.length,
    rowIndex: start.rowIndex + inserted.length - 1,
  }
}

const transformPosition = (position: Position, start: Position, end: Position, inserted: readonly string[], affinity: 'left' | 'right'): Position => {
  const startComparison = comparePositions(position, start)
  const endComparison = comparePositions(position, end)

  if (startComparison < 0 || (startComparison === 0 && affinity === 'left')) {
    return position
  }
  if (endComparison <= 0) {
    return getInsertedEnd(start, inserted)
  }
  const insertedEnd = getInsertedEnd(start, inserted)
  if (position.rowIndex === end.rowIndex) {
    return {
      columnIndex: insertedEnd.columnIndex + position.columnIndex - end.columnIndex,
      rowIndex: insertedEnd.rowIndex,
    }
  }
  return {
    columnIndex: position.columnIndex,
    rowIndex: insertedEnd.rowIndex + position.rowIndex - end.rowIndex,
  }
}

const overlapsDeletedText = (diagnostic: Diagnostic, start: Position, end: Position): boolean => {
  if (comparePositions(start, end) === 0) {
    return false
  }
  const diagnosticStart = { columnIndex: diagnostic.columnIndex, rowIndex: diagnostic.rowIndex }
  const diagnosticEnd = { columnIndex: diagnostic.endColumnIndex, rowIndex: diagnostic.endRowIndex }
  return comparePositions(start, diagnosticEnd) < 0 && comparePositions(end, diagnosticStart) > 0
}

const transformDiagnostic = (diagnostic: Diagnostic, changes: readonly any[]): Diagnostic | undefined => {
  let transformed = diagnostic
  let linesDelta = 0

  for (const change of changes) {
    const start = {
      columnIndex: change.start.columnIndex,
      rowIndex: change.start.rowIndex + linesDelta,
    }
    const end = {
      columnIndex: change.end.columnIndex,
      rowIndex: change.end.rowIndex + linesDelta,
    }
    if (overlapsDeletedText(transformed, start, end)) {
      return undefined
    }
    const inserted = change.inserted.length > 0 ? change.inserted : ['']
    const diagnosticStart = transformPosition({ columnIndex: transformed.columnIndex, rowIndex: transformed.rowIndex }, start, end, inserted, 'right')
    const diagnosticEnd = transformPosition(
      { columnIndex: transformed.endColumnIndex, rowIndex: transformed.endRowIndex },
      start,
      end,
      inserted,
      'left',
    )
    if (comparePositions(diagnosticStart, diagnosticEnd) > 0) {
      return undefined
    }
    transformed = {
      ...transformed,
      columnIndex: diagnosticStart.columnIndex,
      endColumnIndex: diagnosticEnd.columnIndex,
      endRowIndex: diagnosticEnd.rowIndex,
      rowIndex: diagnosticStart.rowIndex,
    }
    linesDelta += inserted.length - change.deleted.length
  }

  return transformed
}

export const transformDiagnostics = (diagnostics: readonly Diagnostic[], changes: readonly any[]): readonly Diagnostic[] => {
  if (changes.length === 0 || diagnostics.length === 0) {
    return diagnostics
  }
  return diagnostics.flatMap((diagnostic) => {
    const transformed = transformDiagnostic(diagnostic, changes)
    return transformed ? [transformed] : []
  })
}
