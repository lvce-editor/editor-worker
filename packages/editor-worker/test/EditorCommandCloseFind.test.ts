import { expect, test } from '@jest/globals'
import { WhenExpression, WidgetId } from '@lvce-editor/constants'
import * as EditorCommandCloseFind from '../src/parts/EditorCommand/EditorCommandCloseFind.ts'

test('closeFind removes the widget and restores editor focus', () => {
  const editor = {
    additionalFocus: WhenExpression.FocusFindWidget,
    focus: WhenExpression.FocusFindWidget,
    focused: false,
    widgets: [{ id: WidgetId.Find }],
  }

  expect(EditorCommandCloseFind.closeFind(editor)).toEqual({
    additionalFocus: 0,
    focus: WhenExpression.FocusEditorText,
    focused: true,
    widgets: [],
  })
})
