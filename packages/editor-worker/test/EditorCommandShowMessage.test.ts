import { expect, test } from '@jest/globals'
import * as EditorCommandShowMessage from '../src/parts/EditorCommand/EditorCommandShowMessage.ts'

test('editorShowMessage adds an overlay message widget', () => {
  const editor = {
    columnWidth: 8,
    rowHeight: 20,
    uid: 1,
    widgets: [],
    x: 10,
    y: 30,
  }

  const newEditor = EditorCommandShowMessage.editorShowMessage(editor, 2, 3, 'No definition found', false)

  expect(newEditor.widgets).toEqual([
    {
      id: 9,
      newState: {
        message: 'No definition found',
        uid: expect.any(Number),
        x: 34,
        y: 90,
      },
    },
  ])
})

test('editorShowMessage replaces an existing overlay message widget', () => {
  const editor = {
    columnWidth: 8,
    rowHeight: 20,
    widgets: [],
    x: 10,
    y: 30,
  }
  const editorWithMessage = EditorCommandShowMessage.editorShowMessage(editor, 2, 3, 'First message', false)
  const { uid } = editorWithMessage.widgets[0].newState

  const newEditor = EditorCommandShowMessage.editorShowMessage(editorWithMessage, 3, 4, 'Second message', false)

  expect(newEditor.widgets).toEqual([
    {
      id: 9,
      newState: {
        message: 'Second message',
        uid,
        x: 42,
        y: 110,
      },
    },
  ])
})
