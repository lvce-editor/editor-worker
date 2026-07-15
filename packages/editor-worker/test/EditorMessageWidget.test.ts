import { expect, test } from '@jest/globals'
import * as EditorMessageWidget from '../src/parts/EditorMessageWidget/EditorMessageWidget.ts'

test('addToEditor replaces an existing message widget', () => {
  const editor = EditorMessageWidget.addToEditor({ widgets: [] }, 'First message', 10, 20)
  const { uid } = editor.widgets[0].newState

  const newEditor = EditorMessageWidget.addToEditor(editor, 'Second message', 30, 40)

  expect(newEditor.widgets).toEqual([
    {
      id: 9,
      newState: {
        message: 'Second message',
        uid,
        x: 30,
        y: 40,
      },
      oldState: {
        message: 'First message',
        uid,
        x: 10,
        y: 20,
      },
    },
  ])
})

test('render returns overlay message virtual dom', () => {
  const editor = EditorMessageWidget.addToEditor({ widgets: [] }, 'No definition found', 10, 20)
  const widget = editor.widgets[0]

  expect(EditorMessageWidget.render(widget)).toEqual([
    [
      'Viewlet.setDom2',
      widget.newState.uid,
      [
        {
          childCount: 2,
          className: 'Viewlet EditorMessage EditorOverlayMessage',
          style: 'position:fixed;left:10px;top:20px;',
          tabIndex: -1,
          type: 4,
        },
        {
          childCount: 1,
          className: 'EditorMessageText',
          type: 4,
        },
        {
          childCount: 0,
          text: 'No definition found',
          type: 12,
        },
        {
          childCount: 0,
          className: 'EditorMessageTriangle',
          type: 4,
        },
      ],
    ],
  ])
})
