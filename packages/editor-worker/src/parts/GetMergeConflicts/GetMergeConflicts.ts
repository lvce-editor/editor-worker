import type { MergeConflict } from '../MergeConflict/MergeConflict.ts'

const isStartMarker = (line: string): boolean => /^<{7}(?: .*)?$/.test(line)
const isBaseMarker = (line: string): boolean => /^\|{7}(?: .*)?$/.test(line)
const isSeparatorMarker = (line: string): boolean => /^={7}$/.test(line)
const isEndMarker = (line: string): boolean => /^>{7}(?: .*)?$/.test(line)

const getMergeConflict = (lines: readonly string[], startRowIndex: number): MergeConflict | undefined => {
  let baseMarkerRowIndex = -1
  let separatorRowIndex = -1
  let endRowIndex = -1
  for (let rowIndex = startRowIndex + 1; rowIndex < lines.length; rowIndex++) {
    const line = lines[rowIndex]
    if (isStartMarker(line)) {
      return undefined
    }
    if (separatorRowIndex === -1 && baseMarkerRowIndex === -1 && isBaseMarker(line)) {
      baseMarkerRowIndex = rowIndex
      continue
    }
    if (separatorRowIndex === -1 && isSeparatorMarker(line)) {
      separatorRowIndex = rowIndex
      continue
    }
    if (isEndMarker(line)) {
      endRowIndex = rowIndex
      break
    }
  }
  if (separatorRowIndex === -1 || endRowIndex === -1 || baseMarkerRowIndex > separatorRowIndex) {
    return undefined
  }
  const currentEndRowIndex = baseMarkerRowIndex === -1 ? separatorRowIndex : baseMarkerRowIndex
  return {
    baseEndRowIndex: separatorRowIndex,
    baseStartRowIndex: baseMarkerRowIndex === -1 ? separatorRowIndex : baseMarkerRowIndex + 1,
    currentEndRowIndex,
    currentStartRowIndex: startRowIndex + 1,
    endRowIndex,
    incomingEndRowIndex: endRowIndex,
    incomingStartRowIndex: separatorRowIndex + 1,
    separatorRowIndex,
    startRowIndex,
  }
}

export const getMergeConflicts = (lines: readonly string[]): readonly MergeConflict[] => {
  const conflicts: MergeConflict[] = []
  let rowIndex = 0
  while (rowIndex < lines.length) {
    if (!isStartMarker(lines[rowIndex])) {
      rowIndex++
      continue
    }
    const conflict = getMergeConflict(lines, rowIndex)
    if (conflict) {
      conflicts.push(conflict)
      rowIndex = conflict.endRowIndex + 1
      continue
    }
    const nextEndMarker = lines.findIndex((line, index) => index > rowIndex && isEndMarker(line))
    rowIndex = (nextEndMarker === -1 ? rowIndex : nextEndMarker) + 1
  }
  return conflicts
}
