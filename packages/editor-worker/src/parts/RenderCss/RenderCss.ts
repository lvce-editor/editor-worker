import { ViewletCommand } from '@lvce-editor/constants'
import type { EditorState } from '../State/State.ts'
import { getCss } from '../GetCss/GetCss.ts'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'

export const renderCss = (oldState: EditorState, newState: EditorState): readonly any[] => {
  const { deltaY, finalDeltaY, height, rowHeight, scrollBarHeight, uid } = newState
  const scrollBarTop = ScrollBarFunctions.getScrollBarY(deltaY, finalDeltaY, height, scrollBarHeight)
  const css = getCss(rowHeight, scrollBarHeight, scrollBarTop)
  return [ViewletCommand.SetCss, uid, css]
}
