import { expect, test } from '@jest/globals'
import * as GetEditorMessageVirtualDom from '../src/parts/GetEditorMessageVirtualDom/GetEditorMessageVirtualDom.ts'
import { text } from '../src/parts/VirtualDomHelpers/VirtualDomHelpers.ts'

test('getEditorMessageVirtualDom - basic message', () => {
  const message = 'Test message'
  const dom = GetEditorMessageVirtualDom.getEditorMessageVirtualDom(message)
  expect(dom).toEqual([
    [
      {
        type: 4,
        className: 'Viewlet EditorMessage',
        tabIndex: -1,
        childCount: 2,
      },
      {
        type: 4,
        className: 'EditorMessageText',
        childCount: 1,
      },
      text('Test message'),
      {
        type: 4,
        className: 'EditorMessageTriangle',
        childCount: 0,
      },
    ],
  ])
})
