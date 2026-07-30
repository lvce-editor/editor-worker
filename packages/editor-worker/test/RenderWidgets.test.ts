import { beforeEach, expect, test } from '@jest/globals'
import * as RenderWidgets from '../src/parts/RenderWidgets/RenderWidgets.ts'
import * as WidgetRegistry from '../src/parts/WidgetRegistry/WidgetRegistry.ts'
import * as WidgetRevision from '../src/parts/WidgetRevision/WidgetRevision.ts'

const addedWidgetId = 801
const changedWidgetId = 802
const removedWidgetId = 803

beforeEach(() => {
  WidgetRevision.reset()
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
    uid: 42,
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
    uid: 42,
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
    ['Viewlet.setWidgets', 42, 1, [3, 4]],
  ])
})

test('renderWidgets filters focus context commands', () => {
  const widgetId = 804
  WidgetRegistry.set(widgetId, {
    add: () => [
      ['Viewlet.setFocusContext', 1],
      ['add-widget', 1],
    ],
  })
  const oldState: any = {
    uid: 42,
    widgets: [],
  }
  const newState: any = {
    uid: 42,
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
    ['add-widget', 1],
    ['Viewlet.setWidgets', 42, 1, [1]],
  ])
})

test('renderWidgets increments revisions and filters imperative mounting', () => {
  const widgetId = 805
  WidgetRegistry.set(widgetId, {
    add: () => [
      ['Viewlet.setDom2', 1, []],
      ['Viewlet.appendToBody', 1],
    ],
    render: () => [],
  })
  const emptyState: any = { uid: 42, widgetRevision: 0, widgets: [] }
  const widget = { id: widgetId, newState: { uid: 1 } }
  const addedState: any = { ...emptyState, widgets: [widget] }
  const changedState: any = { ...addedState, widgets: [{ ...widget, oldState: widget.newState }] }

  expect(RenderWidgets.renderWidgets(emptyState, addedState)).toEqual([
    ['Viewlet.setDom2', 1, []],
    ['Viewlet.setWidgets', 42, 1, [1]],
  ])
  expect(RenderWidgets.renderWidgets(addedState, changedState)).toEqual([['Viewlet.setWidgets', 42, 2, [1]]])
})
