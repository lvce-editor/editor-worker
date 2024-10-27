import { expect, test } from '@jest/globals'
import * as FindWidgetFactory from '../src/parts/FindWidgetFactory/FindWidgetFactory.ts'
import * as FindWidgetFocusPreviousMatchButton from '../src/parts/FindWidgetFocusPreviousMatchButton/FindWidgetFocusPreviousMatchButton.ts'
import * as FocusKey from '../src/parts/FocusKey/FocusKey.ts'

test('focus', () => {
  const { oldState } = FindWidgetFactory.create()
  const newState = FindWidgetFocusPreviousMatchButton.focusPreviousMatchButton(oldState)
  expect(newState.focus).toBe(FocusKey.FocusFindWidgetPreviousMatchButton)
})
