import { expect, test } from '@jest/globals'
import { WidgetId } from '@lvce-editor/constants'
import * as EditorFindWidget from '../src/parts/EditorFindWidget/EditorFindWidget.ts'
import * as RenderMethod from '../src/parts/RenderMethod/RenderMethod.ts'

test('focusFindInput - focuses the existing find input', () => {
  const widgetState = {
    commands: [],
    uid: 7,
  }
  const editor = {
    widgets: [
      {
        id: WidgetId.Find,
        newState: widgetState,
        oldState: widgetState,
      },
    ],
  }

  const result = EditorFindWidget.focusFindInput(editor)

  expect(result.widgets[0].newState.commands).toEqual([[RenderMethod.FocusSelector, 7, '[name="search-value"]']])
})

test('focusFindInput - returns the editor unchanged when find is closed', () => {
  const editor = {
    widgets: [],
  }

  expect(EditorFindWidget.focusFindInput(editor)).toBe(editor)
})

test('render - associates the editor uid with focus context commands', () => {
  const oldState = {
    commands: [],
    editorUid: 3,
    uid: 7,
  }
  const newState = {
    commands: [[RenderMethod.SetFocusContext, 43]],
    editorUid: 3,
    uid: 7,
  }
  const widget = {
    id: WidgetId.Find,
    newState,
    oldState,
  }

  expect(EditorFindWidget.render(widget as any)).toEqual([[RenderMethod.SetFocusContext, 3, 43]])
})

test('render - forwards incremental patches to the widget without wrapping them', () => {
  const patches = [[1, 2, '1 of 3']]
  const command = ['Viewlet.setPatches', 7, patches]
  const widget = {
    id: WidgetId.Find,
    newState: { commands: [command], editorUid: 3, uid: 7 },
    oldState: { commands: [], editorUid: 3, uid: 7 },
  }

  expect(EditorFindWidget.render(widget as any)).toEqual([command])
})
