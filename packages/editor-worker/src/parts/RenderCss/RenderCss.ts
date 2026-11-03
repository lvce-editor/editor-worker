import { ViewletCommand } from '@lvce-editor/constants'
import type { EditorState } from '../State/State.ts'
import { getCss } from '../GetCss/GetCss.ts'
import { getHorizontalScrollDimensions } from '../GetHorizontalScrollDimensions/GetHorizontalScrollDimensions.ts'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'

export const renderCss = (oldState: EditorState, newState: EditorState, horizontalThumbInDom = true): readonly any[] => {
  const { deltaY, finalDeltaY, gutterWidth, height, rowHeight, scrollBarHeight, uid } = newState
  const scrollBarTop = ScrollBarFunctions.getScrollBarY(deltaY, finalDeltaY, height, scrollBarHeight)
  let scrollBarWidth = 0
  let scrollBarLeft = 0
  if (!horizontalThumbInDom) {
    const { width } = getHorizontalScrollDimensions(newState)
    scrollBarWidth = ScrollBarFunctions.getScrollBarSize(width, newState.longestLineWidth, newState.minimumSliderSize)
    scrollBarLeft = ScrollBarFunctions.getScrollBarOffset(newState.deltaX, Math.max(0, newState.longestLineWidth - width), width, scrollBarWidth)
  }
  const decorationCss = (newState.textDecorations || [])
    .map(({ color }, index) => `.Editor[data-uid="${uid}"] .EditorTextDecoration${index} { background-color: ${color}; }`)
    .join('\n')
  // Horizontal thumb geometry is patched on the thumb itself. Keep the
  // editor stylesheet stable while typing into an overflowing line.
  const css = decorationCss + getCss(uid, rowHeight, scrollBarHeight, scrollBarTop, scrollBarWidth, scrollBarLeft, deltaY)
  return [ViewletCommand.SetCss, uid, gutterWidth ? `${css}\n.Editor[data-uid="${uid}"] .Gutter { width: ${gutterWidth}px; }\n` : css]
}
