import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetEditorContentVirtualDom from '../src/parts/GetEditorContentVirtualDom/GetEditorContentVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getEditorContentVirtualDom', () => {
  const dom = GetEditorContentVirtualDom.getEditorContentVirtualDom({
    cursorInfos: ['1px 2px'],
    deltaY: 40,
    diagnostics: [{ height: 10, type: 'error', width: 20, x: 3, y: 4 }],
    differences: [0],
    finalDeltaY: 80,
    height: 40,
    scrollBarDiagnostics: [{ height: 5, top: 8, type: 'warning' }],
    scrollBarHeight: 24,
    scrollBarWidth: 24,
    selectionInfos: [1, 2, 3, 4],
    textInfos: [['x', 'Token X']],
  })

  expect(dom[0]).toEqual({
    childCount: 5,
    className: 'EditorContent',
    onKeyUp: DomEventListenerFunctions.HandleKeyUp,
    onMouseMove: DomEventListenerFunctions.HandleMouseMove,
    onWheel: DomEventListenerFunctions.HandleWheel,
    type: VirtualDomElements.Div,
  })

  expect(dom.find((node) => node.className === 'ScrollBarThumb ScrollBarThumbVertical')).toEqual({
    childCount: 0,
    className: 'ScrollBarThumb ScrollBarThumbVertical',
    type: VirtualDomElements.Div,
  })
  expect(dom.find((node) => node.className === 'ScrollBarThumb ScrollBarThumbHorizontal')).toEqual({
    childCount: 0,
    className: 'ScrollBarThumb ScrollBarThumbHorizontal',
    type: VirtualDomElements.Div,
  })
  expect(dom).toContainEqual({
    childCount: 0,
    className: 'ScrollBarDiagnostic ScrollBarDiagnosticWarning',
    height: 5,
    top: 8,
    type: VirtualDomElements.Div,
  })
})

test('getEditorContentVirtualDom omits zero-size scrollbar thumbs and keeps empty tracks', () => {
  const dom = GetEditorContentVirtualDom.getEditorContentVirtualDom({
    differences: [],
    scrollBarHeight: 0,
    scrollBarWidth: 0,
    textInfos: [],
  })

  expect(dom).not.toContainEqual(expect.objectContaining({ className: 'ScrollBarThumb ScrollBarThumbVertical' }))
  expect(dom).not.toContainEqual(expect.objectContaining({ className: 'ScrollBarThumb ScrollBarThumbHorizontal' }))
  expect(dom).toContainEqual(expect.objectContaining({ childCount: 0, className: 'ScrollBar ScrollBarVertical' }))
  expect(dom).toContainEqual(expect.objectContaining({ childCount: 0, className: 'ScrollBar ScrollBarHorizontal' }))
})
