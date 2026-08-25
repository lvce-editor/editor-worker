import type { EditorState } from '../State/State.ts'
import * as Assert from '../Assert/Assert.ts'
import * as Clamp from '../Clamp/Clamp.ts'
import * as EditorFolding from '../EditorFolding/EditorFolding.ts'
import * as EditorText from '../EditorText/EditorText.ts'
import * as EditorViewRows from '../EditorViewRows/EditorViewRows.ts'
import * as ScrollingFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'
import * as SyncIncremental from '../SyncIncremental/SyncIncremental.ts'

// TODO this should be in a separate scrolling module
export const setDeltaY = async (state: EditorState, value: number): Promise<EditorState> => {
  Assert.object(state)
  Assert.number(value)
  const { deltaY, finalDeltaY, height, itemHeight, numberOfVisibleLines, scrollBarHeight } = state
  const newDeltaY = Clamp.clamp(value, 0, finalDeltaY)
  if (deltaY === newDeltaY) {
    return state
  }
  const startVisualRow = Math.floor(newDeltaY / itemHeight)
  const hasMergeConflictRows = state.viewLineIndices?.length > 0
  const visibleViewLineIndices = hasMergeConflictRows
    ? EditorViewRows.getVisibleViewLineIndices(state.viewLineIndices, startVisualRow, numberOfVisibleLines)
    : EditorFolding.getViewportLineIndices(state.lines.length, state.foldingRanges || [], startVisualRow, numberOfVisibleLines)
  const visibleLineIndices = hasMergeConflictRows ? EditorViewRows.getVisibleLineIndices(visibleViewLineIndices) : visibleViewLineIndices
  const minLineY = visibleLineIndices[0] ?? 0
  const maxLineY = visibleLineIndices.length === 0 ? 0 : visibleLineIndices.at(-1)! + 1
  const newEditor1 = {
    ...state,
    deltaY: newDeltaY,
    maxLineY,
    minLineY,
    scrollBarY: ScrollingFunctions.getScrollBarY(newDeltaY, finalDeltaY, height, scrollBarHeight),
    visibleLineIndices,
    visibleViewLineIndices,
  }
  const syncIncremental = SyncIncremental.getEnabled()

  const { differences, textInfos } = await EditorText.getVisible(newEditor1, syncIncremental)

  const newEditor2 = {
    ...newEditor1,
    differences,
    textInfos,
  }
  return newEditor2
}
