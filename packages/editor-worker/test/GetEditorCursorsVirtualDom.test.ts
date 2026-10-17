import { expect, test } from '@jest/globals'
import * as GetEditorCursorsVirtualDom from '../src/parts/GetEditorCursorsVirtualDom/GetEditorCursorsVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getEditorCursorsVirtualDom renders cursors when focused', () => {
  expect(GetEditorCursorsVirtualDom.getEditorCursorsVirtualDom(['1px 2px'])).toEqual([
    {
      childCount: 1,
      className: 'LayerCursor',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'EditorCursor',
      translate: '1px 2px',
      type: VirtualDomElements.Div,
    },
  ])
})

test('getEditorCursorsVirtualDom does not render cursors when unfocused', () => {
  expect(GetEditorCursorsVirtualDom.getEditorCursorsVirtualDom(['1px 2px'], false)).toEqual([
    {
      childCount: 0,
      className: 'LayerCursor',
      type: VirtualDomElements.Div,
    },
  ])
})
