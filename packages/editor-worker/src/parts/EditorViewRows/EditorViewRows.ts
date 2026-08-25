import type { MergeConflict } from '../MergeConflict/MergeConflict.ts'

export const toMergeConflictActionsRow = (rowIndex: number): number => ~rowIndex

export const isMergeConflictActionsRow = (viewRow: number): boolean => viewRow < 0

export const getMergeConflictRowIndex = (viewRow: number): number => ~viewRow

export const getViewLineIndices = (
  lineCount: number,
  isRowHidden: (rowIndex: number) => boolean,
  mergeConflicts: readonly MergeConflict[],
): readonly number[] => {
  const conflictStartRows = new Set(mergeConflicts.map((conflict) => conflict.startRowIndex))
  const result: number[] = []
  for (let rowIndex = 0; rowIndex < lineCount; rowIndex++) {
    if (isRowHidden(rowIndex)) {
      continue
    }
    if (conflictStartRows.has(rowIndex)) {
      result.push(toMergeConflictActionsRow(rowIndex))
    }
    result.push(rowIndex)
  }
  return result
}

export const getVisibleViewLineIndices = (
  viewLineIndices: readonly number[],
  startVisualRow: number,
  numberOfVisibleLines: number,
): readonly number[] => {
  return viewLineIndices.slice(startVisualRow, startVisualRow + numberOfVisibleLines)
}

export const getVisibleLineIndices = (visibleViewLineIndices: readonly number[]): readonly number[] => {
  return visibleViewLineIndices.filter((viewRow) => !isMergeConflictActionsRow(viewRow))
}

export const getVisualRowForDocumentRow = (rowIndex: number, viewLineIndices: readonly number[]): number => {
  const visualRow = viewLineIndices.indexOf(rowIndex)
  return visualRow === -1 ? rowIndex : visualRow
}

export const getDocumentRowForVisualRow = (visualRow: number, viewLineIndices: readonly number[]): number => {
  if (visualRow < 0 || visualRow >= viewLineIndices.length) {
    return visualRow
  }
  const viewRow = viewLineIndices[visualRow]
  return isMergeConflictActionsRow(viewRow) ? getMergeConflictRowIndex(viewRow) : viewRow
}
