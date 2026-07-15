import { expect, test } from '@jest/globals'
import * as GetEditorMessageVirtualDom from '../src/parts/GetEditorMessageVirtualDom/GetEditorMessageVirtualDom.ts'
import { text } from '../src/parts/VirtualDomHelpers/VirtualDomHelpers.ts'

test('getEditorMessageVirtualDom - basic message', () => {
  const message = 'Test message'
  const dom = GetEditorMessageVirtualDom.getEditorMessageVirtualDom(message)
  expect(dom).toEqual([
    {
      childCount: 2,
      className: 'Viewlet EditorMessage',
      tabIndex: -1,
      type: 4,
    },
    {
      childCount: 1,
      className: 'EditorMessageText',
      type: 4,
    },
    text('Test message'),
    {
      childCount: 0,
      className: 'EditorMessageTriangle',
      type: 4,
    },
  ])
})
