import { expect, test } from '@jest/globals'
import * as FindWidgetFactory from '../src/parts/FindWidgetFactory/FindWidgetFactory.ts'
import * as FindWidgetFocusReplaceAllButton from '../src/parts/FindWidgetFocusReplaceAllButton/FindWidgetFocusReplaceAllButton.ts'
import * as FocusKey from '../src/parts/FocusKey/FocusKey.ts'

test('focus', () => {
  const { oldState } = FindWidgetFactory.create()
  const newState = FindWidgetFocusReplaceAllButton.focusReplaceAllButton(oldState)
  expect(newState.focus).toBe(FocusKey.FocusFindWidgetReplaceAllButton)
})
