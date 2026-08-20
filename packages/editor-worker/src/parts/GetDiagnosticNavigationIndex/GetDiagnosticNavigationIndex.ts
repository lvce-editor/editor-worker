import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'

export interface DiagnosticNavigationResult {
  readonly diagnostic: Diagnostic
  readonly index: number
}

const compareDiagnostics = (left: Diagnostic, right: Diagnostic): number => {
  return (
    left.rowIndex - right.rowIndex ||
    left.columnIndex - right.columnIndex ||
    left.endRowIndex - right.endRowIndex ||
    left.endColumnIndex - right.endColumnIndex ||
    left.message.localeCompare(right.message) ||
    left.source.localeCompare(right.source) ||
    String(left.code).localeCompare(String(right.code))
  )
}

const isSelectionAtDiagnostic = (selections: Uint32Array, diagnostic: Diagnostic): boolean => {
  return (
    selections.length >= 4 &&
    selections[0] === diagnostic.rowIndex &&
    selections[1] === diagnostic.columnIndex &&
    selections[2] === diagnostic.endRowIndex &&
    selections[3] === diagnostic.endColumnIndex
  )
}

const comparePosition = (diagnostic: Diagnostic, rowIndex: number, columnIndex: number): number => {
  return diagnostic.rowIndex - rowIndex || diagnostic.columnIndex - columnIndex
}

export const getDiagnosticNavigationIndex = (
  diagnostics: readonly Diagnostic[],
  selections: Uint32Array,
  currentDiagnostic: Diagnostic | undefined,
  direction: 1 | -1,
): DiagnosticNavigationResult | undefined => {
  if (diagnostics.length === 0) {
    return undefined
  }
  const orderedDiagnostics = diagnostics.toSorted(compareDiagnostics)
  const currentIndex = currentDiagnostic ? orderedDiagnostics.indexOf(currentDiagnostic) : -1
  if (currentDiagnostic && currentIndex !== -1 && isSelectionAtDiagnostic(selections, currentDiagnostic)) {
    const index = (currentIndex + direction + orderedDiagnostics.length) % orderedDiagnostics.length
    return {
      diagnostic: orderedDiagnostics[index],
      index,
    }
  }
  const rowIndex = selections[2] ?? selections[0] ?? 0
  const columnIndex = selections[3] ?? selections[1] ?? 0
  if (direction === 1) {
    const index = orderedDiagnostics.findIndex((diagnostic) => comparePosition(diagnostic, rowIndex, columnIndex) > 0)
    const wrappedIndex = index === -1 ? 0 : index
    return {
      diagnostic: orderedDiagnostics[wrappedIndex],
      index: wrappedIndex,
    }
  }
  const index = orderedDiagnostics.findLastIndex((diagnostic) => comparePosition(diagnostic, rowIndex, columnIndex) < 0)
  const wrappedIndex = index === -1 ? orderedDiagnostics.length - 1 : index
  return {
    diagnostic: orderedDiagnostics[wrappedIndex],
    index: wrappedIndex,
  }
}
