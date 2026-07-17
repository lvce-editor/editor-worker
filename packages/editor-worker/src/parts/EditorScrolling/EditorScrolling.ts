import type { EditorState } from '../State/State.ts'
import * as Assert from '../Assert/Assert.ts'
import * as Clamp from '../Clamp/Clamp.ts'
import * as EditorFolding from '../EditorFolding/EditorFolding.ts'
import * as EditorText from '../EditorText/EditorText.ts'
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
  const minLineY = Math.floor(newDeltaY / itemHeight)
  const maxLineY = minLineY + numberOfVisibleLines
  const newEditor1 =
    state.foldingRanges?.length > 0
      ? EditorFolding.updateLayout({ ...state, deltaY: newDeltaY }, state.foldingRanges)
      : {
          ...state,
          deltaY: newDeltaY,
          maxLineY,
          minLineY,
          scrollBarY: ScrollingFunctions.getScrollBarY(newDeltaY, finalDeltaY, height, scrollBarHeight),
          ...('visibleLineIndices' in state && {
            visibleLineIndices: Array.from(
              { length: Math.max(Math.min(maxLineY, state.lines.length) - minLineY, 0) },
              (_, index) => minLineY + index,
            ),
          }),
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
