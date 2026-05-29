import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetEditorRowsLayerVirtualDom from '../src/parts/GetEditorRowsLayerVirtualDom/GetEditorRowsLayerVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'
import { text } from '../src/parts/VirtualDomHelpers/VirtualDomHelpers.ts'

test('getEditorRowsVirtualDom', () => {
  const dom = GetEditorRowsLayerVirtualDom.getEditorRowsVirtualDom(
    [
      ['a', 'Token A'],
      ['b', 'Token B'],
    ],
    [0, 4],
  )

  expect(dom[0]).toEqual({
    childCount: 2,
    className: 'EditorRows',
    onMouseDown: DomEventListenerFunctions.HandleMouseDown,
    onPointerDown: DomEventListenerFunctions.HandlePointerDown,
    type: VirtualDomElements.Div,
  })
  expect(dom.slice(1)).toEqual([
    {
      childCount: 1,
      className: 'EditorRow',
      translate: '0px',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'Token A',
      type: VirtualDomElements.Span,
    },
    text('a'),
    {
      childCount: 1,
      className: 'EditorRow',
      translate: '4px',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'Token B',
      type: VirtualDomElements.Span,
    },
    text('b'),
  ])
})
