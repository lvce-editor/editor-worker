import { ViewletCommand } from '@lvce-editor/constants'
import type { EditorState } from '../State/State.ts'
import { getCss } from '../GetCss/GetCss.ts'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'

const getScrollBarLeft = (deltaX: number, longestLineWidth: number, width: number): number => {
  const scrollBarLeft = (deltaX / longestLineWidth) * width
  if (!Number.isFinite(scrollBarLeft)) {
    return 0
  }
  return scrollBarLeft
}

export const renderCss = (oldState: EditorState, newState: EditorState): readonly any[] => {
  const { deltaX, deltaY, finalDeltaY, height, longestLineWidth, minimumSliderSize, rowHeight, scrollBarHeight, uid, width } = newState
  const scrollBarTop = ScrollBarFunctions.getScrollBarY(deltaY, finalDeltaY, height, scrollBarHeight)
  const scrollBarWidth = ScrollBarFunctions.getScrollBarSize(width, longestLineWidth, minimumSliderSize)
  const scrollBarLeft = getScrollBarLeft(deltaX, longestLineWidth, width)
  const css = getCss(rowHeight, scrollBarHeight, scrollBarTop, scrollBarWidth, scrollBarLeft)
  return [ViewletCommand.SetCss, uid, css]
}
