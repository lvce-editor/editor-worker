import { expect, test } from '@jest/globals'
import { getEditorScrollBarDiagnosticsVirtualDom } from '../src/parts/GetEditorScrollBarDiagnosticsVirtualDom/GetEditorScrollBarDiagnosticsVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('renders an empty track even when no scrollbar or diagnostics are needed', () => {
  expect(getEditorScrollBarDiagnosticsVirtualDom([])).toEqual([
    {
      childCount: 0,
      className: 'ScrollBarDiagnostics',
      type: VirtualDomElements.Div,
    },
  ])
})

test('renders error and warning markers', () => {
  expect(
    getEditorScrollBarDiagnosticsVirtualDom([
      { height: 3, top: 10, type: 'error' },
      { height: 3, top: 20, type: 'warning' },
    ]),
  ).toEqual([
    {
      childCount: 2,
      className: 'ScrollBarDiagnostics',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'ScrollBarDiagnostic ScrollBarDiagnosticError',
      height: 3,
      top: 10,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'ScrollBarDiagnostic ScrollBarDiagnosticWarning',
      height: 3,
      top: 20,
      type: VirtualDomElements.Div,
    },
  ])
})

test('uses error styling for unknown severities', () => {
  const dom = getEditorScrollBarDiagnosticsVirtualDom([{ height: 3, top: 10, type: 'unknown' }])

  expect(dom[1]).toEqual(expect.objectContaining({ className: 'ScrollBarDiagnostic ScrollBarDiagnosticError' }))
})
