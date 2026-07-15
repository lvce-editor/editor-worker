import { expect, test } from '@jest/globals'
import * as EditorMessageWidget from '../src/parts/EditorMessageWidget/EditorMessageWidget.ts'

test('render returns overlay message virtual dom', () => {
  const state = { message: 'No definition found', uid: 1, x: 10, y: 20 }
  const widget = { id: 9, newState: state, oldState: state }

  expect(EditorMessageWidget.render(widget)).toEqual([
    [
      'Viewlet.setDom2',
      widget.newState.uid,
      [
        {
          childCount: 1,
          className: 'Viewlet EditorMessage EditorMessageText EditorOverlayMessage',
          style: 'left:10px;top:20px;',
          type: 4,
        },
        {
          childCount: 0,
          text: 'No definition found',
          type: 12,
        },
      ],
    ],
  ])
})
