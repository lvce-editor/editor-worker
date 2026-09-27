import { expect, test } from '@jest/globals'
import { getEditorDiagnosticsVirtualDom } from '../src/parts/GetEditorDiagnosticsVirtualDom/GetEditorDiagnosticsVirtualDom.ts'

test('getEditorDiagnosticsVirtualDom includes bracket matches in the diagnostics layer', () => {
  expect(getEditorDiagnosticsVirtualDom([], [{ height: 20, width: 8, x: 16, y: 40 }])).toEqual([
    {
      childCount: 1,
      className: 'LayerDiagnostics',
      type: 4,
    },
    {
      childCount: 0,
      className: 'BracketMatch',
      height: 20,
      left: 16,
      top: 40,
      type: 4,
      width: 8,
    },
  ])
})
