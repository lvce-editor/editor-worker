import { expect, test } from '@jest/globals'
import * as GetFindWidgetFocusSelector from '../src/parts/GetFindWidgetFocusSelector/GetFindWidgetFocusSelector.ts'
import * as FocusKey from '../src/parts/FocusKey/FocusKey.ts'

test('find', () => {
  const focus = FocusKey.FindWidget
  expect(GetFindWidgetFocusSelector.getFindWidgetFocusSelector(focus)).toBe(`[name="search-value"]`)
})

test('replace', () => {
  const focus = FocusKey.FocusFindWidgetReplace
  expect(GetFindWidgetFocusSelector.getFindWidgetFocusSelector(focus)).toBe('[name="replace-value"]')
})

test('toggleReplace', () => {
  const focus = FocusKey.FocusFindWidgetToggleReplace
  expect(GetFindWidgetFocusSelector.getFindWidgetFocusSelector(focus)).toBe('[name="ToggleReplace"]')
})

test('replaceAll', () => {
  const focus = FocusKey.FocusFindWidgetReplaceAllButton
  expect(GetFindWidgetFocusSelector.getFindWidgetFocusSelector(focus)).toBe('[name="ReplaceAll"]')
})

test('close', () => {
  const focus = FocusKey.FocusFindWidgetCloseButton
  expect(GetFindWidgetFocusSelector.getFindWidgetFocusSelector(focus)).toBe('[name="Close"]')
})

test('focusPrevious', () => {
  const focus = FocusKey.FocusFindWidgetPreviousMatchButton
  expect(GetFindWidgetFocusSelector.getFindWidgetFocusSelector(focus)).toBe('[name="FocusPrevious"]')
})

test('focusNext', () => {
  const focus = FocusKey.FocusFindWidgetNextMatchButton
  expect(GetFindWidgetFocusSelector.getFindWidgetFocusSelector(focus)).toBe('[name="FocusNext"]')
})

test('other', () => {
  const focus = FocusKey.Empty
  expect(GetFindWidgetFocusSelector.getFindWidgetFocusSelector(focus)).toBe('')
})
