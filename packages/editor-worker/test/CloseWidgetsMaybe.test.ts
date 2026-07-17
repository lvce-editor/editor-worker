import { expect, test } from '@jest/globals'
import { WidgetId } from '@lvce-editor/constants'
import * as CloseWidgetsMaybe from '../src/parts/CloseWidgetsMaybe/CloseWidgetsMaybe.ts'

test('closeWidgetsMaybe keeps persistent widgets and closes transient widgets', () => {
  const findWidget = { id: WidgetId.Find }
  const completionWidget = { id: WidgetId.Completion }

  expect(CloseWidgetsMaybe.closeWidgetsMaybe([findWidget, completionWidget])).toEqual([findWidget])
})

test('closeWidgetsMaybe preserves an empty widget array', () => {
  const widgets: readonly any[] = []

  expect(CloseWidgetsMaybe.closeWidgetsMaybe(widgets)).toBe(widgets)
})
