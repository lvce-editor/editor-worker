import { expect, test } from '@jest/globals'
import * as GetEditorVirtualDom from '../src/parts/GetEditorVirtualDom/GetEditorVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'
import { text } from '../src/parts/VirtualDomHelpers/VirtualDomHelpers.ts'

test('getEditorVirtualDom', () => {
  const dom = GetEditorVirtualDom.getEditorVirtualDom({
    cursorInfos: ['144.962px 180px'],
    diagnostics: [
      {
        height: 16,
        type: 'error',
        width: 12,
        x: 4,
        y: 6,
      },
    ],
    differences: [0],
    gutterInfos: [1],
    selectionInfos: [1, 2, 3, 4],
    textInfos: [['#', 'Token Comment']],
  })

  expect(dom).toEqual([
    {
      childCount: 2,
      className: 'Viewlet Editor',
      role: 'code',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'Gutter',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'LineNumber',
      type: VirtualDomElements.Span,
    },
    {
      childCount: 0,
      text: 1,
      type: VirtualDomElements.Text,
    },
    {
      childCount: 4,
      className: 'EditorContent',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 4,
      className: 'EditorLayers',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'Selections',
      type: VirtualDomElements.Div,
    },
    {
      className: 'EditorSelection',
      height: 4,
      left: 1,
      top: 2,
      type: VirtualDomElements.Div,
      width: 3,
    },
    {
      childCount: 1,
      className: 'EditorRows',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorRow',
      translate: '0px',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'Token Comment',
      type: VirtualDomElements.Span,
    },
    text('#'),
    {
      childCount: 1,
      className: 'LayerCursor',
      type: VirtualDomElements.Div,
    },
    {
      className: 'EditorCursor',
      translate: '144.962px 180px',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'LayerDiagnostics',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'Diagnostic DiagnosticError',
      height: 16,
      left: 4,
      top: 6,
      type: VirtualDomElements.Div,
      width: 12,
    },
    {
      childCount: 0,
      className: 'EditorScrollBarDiagnostics',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'ScrollBar ScrollBarVertical',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'ScrollBarThumb ScrollBarThumbVertical',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'ScrollBar ScrollBarHorizontal',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'ScrollBarThumb ScrollBarThumbHorizontal',
      type: VirtualDomElements.Div,
    },
  ])
})
