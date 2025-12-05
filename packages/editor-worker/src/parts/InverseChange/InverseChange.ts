export const inverseChange = (edit: any) => {
  const endColumnIndex = edit.end.columnIndex - edit.deleted[0].length + edit.inserted[0].length
  return {
    deleted: edit.inserted,
    end: {
      columnIndex: endColumnIndex,
      rowIndex: edit.end.rowIndex,
    },
    inserted: edit.deleted,
    start: edit.start,
  }
}
