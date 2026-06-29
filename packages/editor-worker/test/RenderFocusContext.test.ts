import { ViewletCommand, WhenExpression } from '@lvce-editor/constants'
import { expect, test } from '@jest/globals'
import * as RenderFocusContext from '../src/parts/RenderFocusContext/RenderFocusContext.ts'

test('renderFocusContext uses the new editor focus context', () => {
  const oldState: any = {
    focus: WhenExpression.FocusEditorText,
    uid: 1,
  }
  const newState: any = {
    focus: WhenExpression.FocusFindWidget,
    uid: 1,
  }

  expect(RenderFocusContext.renderFocusContext(oldState, newState)).toEqual([
    ViewletCommand.SetFocusContext,
    1,
    WhenExpression.FocusFindWidget,
    0,
    1,
    'Editor',
  ])
})
