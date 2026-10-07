import { ViewletCommand } from '@lvce-editor/constants'
import type { EditorState } from '../State/State.ts'
import { getCss } from '../GetCss/GetCss.ts'
import { getHorizontalScrollDimensions } from '../GetHorizontalScrollDimensions/GetHorizontalScrollDimensions.ts'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'

export const renderCss = (oldState: EditorState, newState: EditorState): readonly any[] => {
  const { deltaX, deltaY, finalDeltaY, gutterWidth, height, longestLineWidth, minimumSliderSize, rowHeight, scrollBarHeight, uid } = newState
  const { width } = getHorizontalScrollDimensions(newState)
  const scrollBarTop = ScrollBarFunctions.getScrollBarY(deltaY, finalDeltaY, height, scrollBarHeight)
  const scrollBarWidth = ScrollBarFunctions.getScrollBarSize(width, longestLineWidth, minimumSliderSize)
  const scrollBarLeft = ScrollBarFunctions.getScrollBarOffset(deltaX, Math.max(0, longestLineWidth - width), width, scrollBarWidth)
  const css = getCss(uid, rowHeight, scrollBarHeight, scrollBarTop, scrollBarWidth, scrollBarLeft, deltaY)
  return [ViewletCommand.SetCss, uid, gutterWidth ? `${css}\n.Editor[data-uid="${uid}"] .Gutter { width: ${gutterWidth}px; }\n` : css]
}
