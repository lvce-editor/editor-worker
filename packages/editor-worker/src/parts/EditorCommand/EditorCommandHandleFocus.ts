import { WhenExpression } from '@lvce-editor/constants'
import type { State } from '../State/State.ts'

export const handleFocus = (editor: State): State => {
  if (editor.focused && editor.focus === WhenExpression.FocusEditorText) {
    return editor
  }
  return {
    ...editor,
    additionalFocus: 0,
    focus: WhenExpression.FocusEditorText,
    focused: true,
  }
}
