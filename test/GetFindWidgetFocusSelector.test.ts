import { expect, test } from '@jest/globals'
import * as GetFindWidgetFocusSelector from '../src/parts/GetFindWidgetFocusSelector/GetFindWidgetFocusSelector.ts'
import * as FocusKey from '../src/parts/FocusKey/FocusKey.ts'

test('find', () => {
  const focus = FocusKey.FindWidget
  expect(GetFindWidgetFocusSelector.getFindWidgetFocusSelector(focus)).toBe(`[name="search-value"]`)
})

test('replace', () => {
  const focus = FocusKey.FindWidgetReplace
  expect(GetFindWidgetFocusSelector.getFindWidgetFocusSelector(focus)).toBe('[name="replace-value"]')
})

test('toggleReplace', () => {
  const focus = FocusKey.FindWidgetToggleReplace
  expect(GetFindWidgetFocusSelector.getFindWidgetFocusSelector(focus)).toBe('[name="ToggleReplace"]')
})

test('replaceAll', () => {
  const focus = FocusKey.FindWidgetReplaceAllButton
  expect(GetFindWidgetFocusSelector.getFindWidgetFocusSelector(focus)).toBe('[name="replaceAll"]')
})

test('close', () => {
  const focus = FocusKey.FindWidgetCloseButton
  expect(GetFindWidgetFocusSelector.getFindWidgetFocusSelector(focus)).toBe('[name="close"]')
})

test('other', () => {
  const focus = FocusKey.Empty
  expect(GetFindWidgetFocusSelector.getFindWidgetFocusSelector(focus)).toBe('')
})
