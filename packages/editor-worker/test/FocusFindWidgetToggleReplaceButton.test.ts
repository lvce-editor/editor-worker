import { expect, test } from '@jest/globals'
import * as FindWidgetFactory from '../src/parts/FindWidgetFactory/FindWidgetFactory.ts'
import * as FindWidgetFocusToggleReplaceButton from '../src/parts/FindWidgetFocusToggleReplaceButton/FindWidgetFocusToggleReplaceButton.ts'
import * as FocusKey from '../src/parts/FocusKey/FocusKey.ts'

test('focus', () => {
  const { oldState } = FindWidgetFactory.create()
  const newState = FindWidgetFocusToggleReplaceButton.focusToggleReplaceButton(oldState)
  expect(newState.focus).toBe(FocusKey.FocusFindWidgetToggleReplace)
})
