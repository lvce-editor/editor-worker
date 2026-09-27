export const inverseChange = (edit: any) => {
  const insertedLines = edit.inserted
  const endRowIndex = edit.start.rowIndex + insertedLines.length - 1
  const endColumnIndex = insertedLines.length === 1 ? edit.start.columnIndex + insertedLines[0].length : insertedLines.at(-1).length
  return {
    deleted: insertedLines,
    end: {
      columnIndex: endColumnIndex,
      rowIndex: endRowIndex,
    },
    inserted: edit.deleted,
    start: edit.start,
  }
}
