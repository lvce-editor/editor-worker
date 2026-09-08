import { WhenExpression } from '@lvce-editor/constants'
import type { EditorState } from '../State/State.ts'

export const handleFocus = (editor: EditorState): EditorState => {
  if (editor.focused && editor.focus === WhenExpression.FocusEditorText && editor.problemsHighlightedRow === -1) {
    return editor
  }
  return {
    ...editor,
    additionalFocus: 0,
    focus: WhenExpression.FocusEditorText,
    focused: true,
    problemsHighlightedRow: -1,
  }
}
