import { beforeEach, expect, test } from '@jest/globals'
import * as ApplyRender from '../src/parts/ApplyRender/ApplyRender.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as WidgetRegistry from '../src/parts/WidgetRegistry/WidgetRegistry.ts'

const widgetId = 99

beforeEach(() => {
  WidgetRegistry.set(widgetId, {
    add() {
      return [
        ['Viewlet.createFunctionalRoot', 'EditorCompletion', 2, true],
        ['Viewlet.appendToBody', 2],
      ]
    },
  })
})

test('applyRender flattens widget render commands', () => {
  const oldState = {
    widgets: [],
  } as any
  const newState = {
    widgets: [
      {
        id: widgetId,
      },
    ],
  } as any

  expect(ApplyRender.applyRender(oldState, newState, [DiffType.RenderWidgets])).toEqual([
    ['Viewlet.createFunctionalRoot', 'EditorCompletion', 2, true],
    ['Viewlet.appendToBody', 2],
  ])
})
