import { ViewletCommand } from '@lvce-editor/constants'
import type { EditorState } from '../State/State.ts'
import { getCss } from '../GetCss/GetCss.ts'

export const renderCss = (oldState: EditorState, newState: EditorState): readonly any[] => {
  const { itemHeight, uid } = newState
  const css = getCss(itemHeight)
  return [ViewletCommand.SetCss, uid, css]
}
