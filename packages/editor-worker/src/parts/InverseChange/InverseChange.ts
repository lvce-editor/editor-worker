export const inverseChange = (edit: any) => {
  const endColumnIndex = edit.end.columnIndex - edit.deleted[0].length + edit.inserted[0].length
  return {
    start: edit.start,
    end: {
      rowIndex: edit.end.rowIndex,
      columnIndex: endColumnIndex,
    },
    inserted: edit.deleted,
    deleted: edit.inserted,
  }
}
