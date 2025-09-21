import * as Assert from '../Assert/Assert.ts'
import * as Clamp from '../Clamp/Clamp.ts'
import * as EditorText from '../EditorText/EditorText.ts'
import * as ScrollingFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'
import * as SyncIncremental from '../SyncIncremental/SyncIncremental.ts'

// TODO this should be in a separate scrolling module
export const setDeltaY = async (state: any, value: number) => {
  Assert.object(state)
  Assert.number(value)
  const { finalDeltaY, deltaY, numberOfVisibleLines, height, scrollBarHeight, itemHeight } = state
  const newDeltaY = Clamp.clamp(value, 0, finalDeltaY)
  if (deltaY === newDeltaY) {
    return state
  }
  const newMinLineY = Math.floor(newDeltaY / itemHeight)
  const newMaxLineY = newMinLineY + numberOfVisibleLines
  const scrollBarY = ScrollingFunctions.getScrollBarY(newDeltaY, finalDeltaY, height, scrollBarHeight)
  const newEditor1 = {
    ...state,
    minLineY: newMinLineY,
    maxLineY: newMaxLineY,
    deltaY: newDeltaY,
    scrollBarY,
  }
  const syncIncremental = SyncIncremental.getEnabled()

  const { textInfos, differences } = await EditorText.getVisible(newEditor1, syncIncremental)

  const newEditor2 = {
    ...newEditor1,
    textInfos,
    differences,
  }
  return newEditor2
}
