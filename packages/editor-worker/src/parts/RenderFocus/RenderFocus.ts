import { ViewletCommand } from '@lvce-editor/constants'
import type { EditorState } from '../State/State.ts'

export const renderFocus = (oldState: EditorState, newState: EditorState): readonly any[] => {
  const selector = '.EditorInput'
  return [ViewletCommand.FocusSelector, newState.uid, selector]
}
