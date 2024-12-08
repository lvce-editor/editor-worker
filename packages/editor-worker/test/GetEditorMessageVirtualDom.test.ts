import { expect, test } from '@jest/globals'
import * as GetEditorMessageVirtualDom from '../src/parts/GetEditorMessageVirtualDom/GetEditorMessageVirtualDom.ts'

test('getEditorMessageVirtualDom - basic message', () => {
  const message = 'Test message'
  const dom = GetEditorMessageVirtualDom.getEditorMessageVirtualDom(message)
  expect(dom).toEqual({
    type: 'div',
    className: 'EditorMessage',
    childNodes: [
      {
        type: 'div',
        className: 'EditorMessageText',
        text: 'Test message',
      },
    ],
  })
})

test('getEditorMessageVirtualDom - empty message', () => {
  const message = ''
  const dom = GetEditorMessageVirtualDom.getEditorMessageVirtualDom(message)
  expect(dom).toEqual({
    type: 'div',
    className: 'EditorMessage',
    childNodes: [
      {
        type: 'div',
        className: 'EditorMessageText',
        text: '',
      },
    ],
  })
})

test('getEditorMessageVirtualDom - message with special characters', () => {
  const message = 'Test & message < > "'
  const dom = GetEditorMessageVirtualDom.getEditorMessageVirtualDom(message)
  expect(dom).toEqual({
    type: 'div',
    className: 'EditorMessage',
    childNodes: [
      {
        type: 'div',
        className: 'EditorMessageText',
        text: 'Test & message < > "',
      },
    ],
  })
})