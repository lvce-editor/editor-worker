import { beforeEach, expect, test } from '@jest/globals'
import * as ApplyRender from '../src/parts/ApplyRender/ApplyRender.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as WidgetRegistry from '../src/parts/WidgetRegistry/WidgetRegistry.ts'

const widgetId = 805

beforeEach(() => {
  WidgetRegistry.set(widgetId, {
    add: (widget: any) => [
      ['create-widget', widget.newState.uid],
      ['append-widget', widget.newState.uid],
    ],
  })
})

test('applyRender flattens widget render commands', () => {
  const oldState: any = {
    widgets: [],
  }
  const newState: any = {
    widgets: [
      {
        id: widgetId,
        newState: {
          uid: 1,
        },
      },
    ],
  }

  expect(ApplyRender.applyRender(oldState, newState, [DiffType.RenderWidgets])).toEqual([
    ['create-widget', 1],
    ['append-widget', 1],
  ])
})
