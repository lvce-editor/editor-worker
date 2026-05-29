import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetEditorContentVirtualDom from '../src/parts/GetEditorContentVirtualDom/GetEditorContentVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getEditorContentVirtualDom', () => {
  const dom = GetEditorContentVirtualDom.getEditorContentVirtualDom({
    cursorInfos: ['1px 2px'],
    diagnostics: [{ height: 10, type: 'error', width: 20, x: 3, y: 4 }],
    differences: [0],
    scrollBarHeight: 24,
    scrollBarDiagnostics: [{ height: 5, type: 'warning', width: 6, x: 7, y: 8 }],
    selectionInfos: [1, 2, 3, 4],
    textInfos: [['x', 'Token X']],
  })

  expect(dom[0]).toEqual({
    childCount: 5,
    className: 'EditorContent',
    onMouseMove: DomEventListenerFunctions.HandleMouseMove,
    type: VirtualDomElements.Div,
  })

  expect(dom.find((node) => node.className === 'ScrollBarThumb ScrollBarThumbVertical')).toEqual({
    childCount: 0,
    className: 'ScrollBarThumb ScrollBarThumbVertical',
    style: 'height:24px;',
    type: VirtualDomElements.Div,
  })
})
