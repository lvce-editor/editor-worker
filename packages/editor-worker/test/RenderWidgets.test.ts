import { beforeEach, expect, test } from '@jest/globals'
import * as RenderWidgets from '../src/parts/RenderWidgets/RenderWidgets.ts'
import * as WidgetRegistry from '../src/parts/WidgetRegistry/WidgetRegistry.ts'

const addedWidgetId = 801
const changedWidgetId = 802
const removedWidgetId = 803

beforeEach(() => {
  WidgetRegistry.set(addedWidgetId, {
    add: (widget: any) => [['add-widget', widget.newState.uid]],
  })
  WidgetRegistry.set(changedWidgetId, {
    render: (widget: any) => [['render-widget', widget.newState.uid]],
  })
  WidgetRegistry.set(removedWidgetId, {
    remove: (widget: any) => [['remove-widget', widget.newState.uid]],
  })
})

test('renderWidgets renders added, changed, and removed widgets', () => {
  const oldState: any = {
    widgets: [
      {
        id: changedWidgetId,
        newState: {
          uid: 1,
        },
      },
      {
        id: removedWidgetId,
        newState: {
          uid: 2,
        },
      },
    ],
  }
  const newState: any = {
    widgets: [
      {
        id: changedWidgetId,
        newState: {
          uid: 3,
        },
      },
      {
        id: addedWidgetId,
        newState: {
          uid: 4,
        },
      },
    ],
  }

  expect(RenderWidgets.renderWidgets(oldState, newState)).toEqual([
    ['add-widget', 4],
    ['render-widget', 3],
    ['remove-widget', 2],
  ])
})

test('renderWidgets preserves focus context commands', () => {
  const widgetId = 804
  WidgetRegistry.set(widgetId, {
    add: () => [
      ['Viewlet.setFocusContext', 1],
      ['add-widget', 1],
    ],
  })
  const oldState: any = {
    uid: 1,
    widgets: [],
  }
  const newState: any = {
    uid: 1,
    widgets: [
      {
        id: widgetId,
        newState: {
          uid: 1,
        },
      },
    ],
  }

  expect(RenderWidgets.renderWidgets(oldState, newState)).toEqual([
    ['Viewlet.setFocusContext', 1, 1, 0, 1, 'Editor'],
    ['add-widget', 1],
  ])
})
