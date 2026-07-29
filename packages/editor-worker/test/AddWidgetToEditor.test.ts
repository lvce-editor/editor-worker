import { expect, test } from '@jest/globals'
import * as AddWidgetToEditor from '../src/parts/AddWidgetToEditor/AddWidgetToEditor.ts'

const newStateGenerator = (_state: { editorUid: number }): { editorUid: number } | undefined => undefined

test('addWidgetToEditor does not add a widget without generated state', async () => {
  const editor = {
    widgets: [],
  }
  const widget = {
    id: 1,
    newState: {
      editorUid: 0,
    },
    oldState: {
      editorUid: 0,
    },
  }
  const result = await AddWidgetToEditor.addWidgetToEditor(1, 2, editor, () => widget, newStateGenerator)

  expect(result).toBe(editor)
  expect(result.widgets).toEqual([])
})
