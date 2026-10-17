import { beforeEach, expect, test } from '@jest/globals'
import { WhenExpression, WidgetId } from '@lvce-editor/constants'
import * as EditorCommandCloseFind from '../src/parts/EditorCommand/EditorCommandCloseFind.ts'
import * as WidgetRevision from '../src/parts/WidgetRevision/WidgetRevision.ts'

beforeEach(() => {
  WidgetRevision.reset()
})

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
    widgetRevision: 1,
    widgets: [],
  })
})
