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
