import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetEditorVirtualDom from '../src/parts/GetEditorVirtualDom/GetEditorVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'
import { text } from '../src/parts/VirtualDomHelpers/VirtualDomHelpers.ts'

test('getEditorVirtualDom', () => {
  const dom = GetEditorVirtualDom.getEditorVirtualDom({
    cursorInfos: ['144.962px 180px'],
    deltaY: 40,
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
    finalDeltaY: 80,
    gutterInfos: [1],
    height: 40,
    scrollBarHeight: 24,
    selectionInfos: [1, 2, 3, 4],
    textInfos: [['#', 'Token Comment']],
  })

  expect(dom).toEqual([
    {
      childCount: 2,
      className: 'Viewlet Editor',
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
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
      childCount: 5,
      className: 'EditorContent',
      onMouseMove: DomEventListenerFunctions.HandleMouseMove,
      type: VirtualDomElements.Div,
    },
    {
      ariaAutoComplete: 'list',
      ariaMultiLine: 'true',
      ariaRoleDescription: 'editor',
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      childCount: 0,
      className: 'EditorInput',
      name: 'editor',
      onBeforeInput: DomEventListenerFunctions.HandleBeforeInput,
      onBlur: DomEventListenerFunctions.HandleBlur,
      onCompositionEnd: DomEventListenerFunctions.HandleCompositionEnd,
      onCompositionStart: DomEventListenerFunctions.HandleCompositionStart,
      onCompositionUpdate: DomEventListenerFunctions.HandleCompositionUpdate,
      onCut: DomEventListenerFunctions.HandleCut,
      onFocus: DomEventListenerFunctions.HandleFocus,
      onPaste: DomEventListenerFunctions.HandlePaste,
      role: 'textbox',
      spellcheck: false,
      type: VirtualDomElements.TextArea,
      wrap: 'off',
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
      childCount: 0,
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
      onMouseDown: DomEventListenerFunctions.HandleMouseDown,
      onPointerDown: DomEventListenerFunctions.HandlePointerDown,
      onWheel: DomEventListenerFunctions.HandleWheel,
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
      childCount: 0,
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
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      onPointerDown: DomEventListenerFunctions.HandleScrollBarVerticalPointerDown,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'ScrollBarThumb ScrollBarThumbVertical',
      style: 'height:24px;',
      translate: '0 16px',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'ScrollBar ScrollBarHorizontal',
      onPointerDown: DomEventListenerFunctions.HandleScrollBarHorizontalPointerDown,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'ScrollBarThumb ScrollBarThumbHorizontal',
      type: VirtualDomElements.Div,
    },
  ])
})
