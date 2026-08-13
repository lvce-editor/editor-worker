import { expect, test } from '@jest/globals'
import * as GetHoverVirtualDom from '../src/parts/GetHoverVirtualDom/GetHoverVirtualDom.ts'

test('marks a single diagnostic as a diagnostic-only hover', () => {
  const dom = GetHoverVirtualDom.getHoverVirtualDom([], '', [{ message: 'Use const instead' }])

  expect(dom[0].className).toBe('Viewlet EditorHover EditorHoverDiagnosticOnly')
})

test('does not mark a hover with additional information as diagnostic-only', () => {
  const dom = GetHoverVirtualDom.getHoverVirtualDom([['const value = 1']], '', [{ message: 'Use const instead' }])

  expect(dom[0].className).toBe('Viewlet EditorHover')
})
