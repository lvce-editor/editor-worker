import * as Assert from '../Assert/Assert.ts'
import * as Clamp from '../Clamp/Clamp.ts'
import * as EditorText from '../EditorText/EditorText.ts'
import * as ScrollingFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'
import * as SyncIncremental from '../SyncIncremental/SyncIncremental.ts'

// TODO this should be in a separate scrolling module
export const setDeltaY = async (state: any, value: number) => {
  Assert.object(state)
  Assert.number(value)
  const { deltaY, finalDeltaY, height, itemHeight, numberOfVisibleLines, scrollBarHeight } = state
  const newDeltaY = Clamp.clamp(value, 0, finalDeltaY)
  if (deltaY === newDeltaY) {
    return state
  }
  const newMinLineY = Math.floor(newDeltaY / itemHeight)
  const newMaxLineY = newMinLineY + numberOfVisibleLines
  const scrollBarY = ScrollingFunctions.getScrollBarY(newDeltaY, finalDeltaY, height, scrollBarHeight)
  const newEditor1 = {
    ...state,
    deltaY: newDeltaY,
    maxLineY: newMaxLineY,
    minLineY: newMinLineY,
    scrollBarY,
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
