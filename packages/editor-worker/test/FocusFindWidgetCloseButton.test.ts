import { expect, test } from '@jest/globals'
import * as FindWidgetFocusCloseButton from '../src/parts/FindWidgetFocusCloseButton/FindWidgetFocusCloseButton.ts'
import * as FindWidgetFactory from '../src/parts/FindWidgetFactory/FindWidgetFactory.ts'
import * as FocusKey from '../src/parts/FocusKey/FocusKey.ts'

test('focus', () => {
  const { oldState } = FindWidgetFactory.create()
  const newState = FindWidgetFocusCloseButton.focusCloseButton(oldState)
  expect(newState.focus).toBe(FocusKey.FocusFindWidgetCloseButton)
})
