import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'

export const diagnosticContainsPosition = (diagnostic: Diagnostic, rowIndex: number, columnIndex: number): boolean => {
  const { columnIndex: startColumnIndex, endColumnIndex, endRowIndex, rowIndex: startRowIndex } = diagnostic
  if (rowIndex < startRowIndex || rowIndex > endRowIndex) {
    return false
  }
  if (startRowIndex === endRowIndex && startColumnIndex === endColumnIndex) {
    return rowIndex === startRowIndex && columnIndex === startColumnIndex
  }
  if (rowIndex === startRowIndex && columnIndex < startColumnIndex) {
    return false
  }
  if (rowIndex === endRowIndex && columnIndex >= endColumnIndex) {
    return false
  }
  return true
}
