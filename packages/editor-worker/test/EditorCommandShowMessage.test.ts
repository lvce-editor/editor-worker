import { expect, test } from '@jest/globals'
import * as EditorCommandShowMessage from '../src/parts/EditorCommand/EditorCommandShowMessage.ts'

test('editorShowMessage positions an overlay message at the scrolled cursor', async () => {
  const editor = {
    charWidth: 8,
    columnWidth: 8,
    deltaX: 4,
    fontFamily: 'Fira Code',
    fontSize: 15,
    fontWeight: 400,
    gutterWidth: 20,
    isMonospaceFont: true,
    letterSpacing: 0,
    lines: ['abcdef', 'abcdef', 'abcdef', 'abcdef'],
    rowHeight: 20,
    tabSize: 2,
    widgets: [],
    width: 300,
    x: 10,
    y: 30,
  }

  const newEditor = await EditorCommandShowMessage.editorShowMessage(editor, 2, 3, 'No definition found', false)

  expect(newEditor.widgets).toEqual([
    {
      id: 9,
      newState: {
        message: 'No definition found',
        uid: expect.any(Number),
        x: 50,
        y: 90,
      },
    },
  ])
})

test('editorShowMessage replaces an existing overlay message widget', async () => {
  const editor = {
    charWidth: 8,
    columnWidth: 8,
    deltaX: 0,
    fontFamily: 'Fira Code',
    fontSize: 15,
    fontWeight: 400,
    gutterWidth: 0,
    isMonospaceFont: true,
    letterSpacing: 0,
    lines: ['abcdef', 'abcdef', 'abcdef', 'abcdef'],
    rowHeight: 20,
    tabSize: 2,
    widgets: [],
    width: 300,
    x: 10,
    y: 30,
  }
  const editorWithMessage = await EditorCommandShowMessage.editorShowMessage(editor, 2, 3, 'First message', false)
  const { uid } = editorWithMessage.widgets[0].newState

  const newEditor = await EditorCommandShowMessage.editorShowMessage(editorWithMessage, 3, 4, 'Second message', false)

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
