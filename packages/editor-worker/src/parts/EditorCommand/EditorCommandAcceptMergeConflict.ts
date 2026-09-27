import type { MergeConflict } from '../MergeConflict/MergeConflict.ts'
import type { EditorState } from '../State/State.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import { emptyIncrementalEdits } from '../EmptyIncrementalEdits/EmptyIncrementalEdits.ts'
import { getMergeConflicts } from '../GetMergeConflicts/GetMergeConflicts.ts'

const getAcceptedLines = (lines: readonly string[], conflict: MergeConflict, action: string): readonly string[] | undefined => {
  const current = lines.slice(conflict.currentStartRowIndex, conflict.currentEndRowIndex)
  const incoming = lines.slice(conflict.incomingStartRowIndex, conflict.incomingEndRowIndex)
  switch (action) {
    case 'both':
      return [...current, ...incoming]
    case 'current':
      return current
    case 'incoming':
      return incoming
    default:
      return undefined
  }
}

export const acceptMergeConflict = async (state: EditorState, action: string, rowIndexValue: string | number): Promise<EditorState> => {
  const rowIndex = Number(rowIndexValue)
  if (!Number.isSafeInteger(rowIndex)) {
    return state
  }
  const conflict = getMergeConflicts(state.lines).find((candidate) => candidate.startRowIndex === rowIndex)
  if (!conflict) {
    return state
  }
  const acceptedLines = getAcceptedLines(state.lines, conflict, action)
  if (!acceptedLines) {
    return state
  }
  const inserted = acceptedLines.length === 0 ? [''] : acceptedLines
  const start = { columnIndex: 0, rowIndex: conflict.startRowIndex }
  const end = { columnIndex: state.lines[conflict.endRowIndex].length, rowIndex: conflict.endRowIndex }
  const deleted = state.lines.slice(conflict.startRowIndex, conflict.endRowIndex + 1)
  const selections = new Uint32Array([conflict.startRowIndex, 0, conflict.startRowIndex, 0])
  const result = await Editor.scheduleDocumentAndCursorsSelections(state, [{ deleted, end, inserted, origin: EditOrigin.Unknown, start }], selections)
  return {
    ...result,
    incrementalEdits: emptyIncrementalEdits,
  }
}

export const handleMergeConflictActionsMouseDown = (state: EditorState): EditorState => state
