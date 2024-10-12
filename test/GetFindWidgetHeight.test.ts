import { expect, test } from '@jest/globals'
import * as GetFindWidgetHeight from '../src/parts/GetFindWidgetHeight/GetFindWidgetHeight.ts'

test('expanded', () => {
  const replaceExpanded = true
  expect(GetFindWidgetHeight.getFindWidgetHeight(replaceExpanded)).toBe(60)
})

test('collapsed', () => {
  const replaceExpanded = false
  expect(GetFindWidgetHeight.getFindWidgetHeight(replaceExpanded)).toBe(30)
})
