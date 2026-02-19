import { ViewletCommand, WhenExpression } from '@lvce-editor/constants'
import type { EditorState } from '../State/State.ts'

export const renderFocusContext = (oldState: EditorState, newState: EditorState): readonly any[] => {
  return [ViewletCommand.SetFocusContext, newState.uid, WhenExpression.FocusExplorer]
}
