interface Position {
  readonly columnIndex: number
  readonly rowIndex: number
}

interface Change {
  readonly deleted: readonly string[]
  readonly end: Position
  readonly inserted: readonly string[]
  readonly start: Position
}

const comparePositions = (position: Position, other: Position): number => {
  if (position.rowIndex !== other.rowIndex) {
    return position.rowIndex - other.rowIndex
  }
  return position.columnIndex - other.columnIndex
}

const transformPosition = (position: Position, start: Position, end: Position, inserted: readonly string[]): Position => {
  if (comparePositions(position, start) < 0) {
    return position
  }

  const insertedEnd =
    inserted.length <= 1
      ? {
          columnIndex: start.columnIndex + (inserted[0]?.length || 0),
          rowIndex: start.rowIndex,
        }
      : {
          columnIndex: inserted.at(-1)?.length || 0,
          rowIndex: start.rowIndex + inserted.length - 1,
        }

  if (comparePositions(position, end) <= 0) {
    return insertedEnd
  }

  if (position.rowIndex === end.rowIndex) {
    return {
      columnIndex: insertedEnd.columnIndex + position.columnIndex - end.columnIndex,
      rowIndex: insertedEnd.rowIndex,
    }
  }

  return {
    columnIndex: position.columnIndex,
    rowIndex: position.rowIndex + inserted.length - (end.rowIndex - start.rowIndex + 1),
  }
}

export const transformSelections = (selections: Uint32Array, changes: readonly Change[]): Uint32Array => {
  const transformed = new Uint32Array(selections)
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
    for (let i = 0; i < transformed.length; i += 2) {
      const position = transformPosition(
        {
          columnIndex: transformed[i + 1],
          rowIndex: transformed[i],
        },
        start,
        end,
        change.inserted,
      )
      transformed[i] = position.rowIndex
      transformed[i + 1] = position.columnIndex
    }
    linesDelta += change.inserted.length - change.deleted.length
  }
  return transformed
}
