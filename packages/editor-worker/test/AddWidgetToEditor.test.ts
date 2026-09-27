import { beforeEach, expect, test } from '@jest/globals'
import * as AddWidgetToEditor from '../src/parts/AddWidgetToEditor/AddWidgetToEditor.ts'
import * as EditorCommandCloseFind from '../src/parts/EditorCommand/EditorCommandCloseFind.ts'
import * as WidgetRevision from '../src/parts/WidgetRevision/WidgetRevision.ts'

const newStateGenerator = (_state: { editorUid: number }): { editorUid: number } | undefined => undefined

beforeEach(() => {
  WidgetRevision.reset()
})

test('addWidgetToEditor does not add a widget without generated state', async () => {
  const editor = {
    uid: 42,
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

test('closing a widget while it opens prevents the delayed result from resurrecting it', async () => {
  const { promise: statePromise, resolve: resolveState } = Promise.withResolvers<{ uid: number }>()
  const editor = {
    uid: 42,
    widgetRevision: 0,
    widgets: [],
  }
  const widget = {
    id: 1,
    newState: { editorUid: 0, uid: 10 },
    oldState: { editorUid: 0, uid: 10 },
  }

  const opening = AddWidgetToEditor.addWidgetToEditor(
    1,
    2,
    editor,
    () => widget,
    () => statePromise,
  )
  expect(EditorCommandCloseFind.closeFind(editor)).toBe(editor)
  resolveState({ uid: 10 })
  const result = await opening

  expect(result).toBe(editor)
  expect(result.widgets).toEqual([])
})
