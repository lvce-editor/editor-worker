import { expect, test } from '@jest/globals'
import * as GetDiagnosticClassName from '../src/parts/GetDiagnosticClassName/GetDiagnosticClassName.ts'

test('error', () => {
  const type = 'error'
  expect(GetDiagnosticClassName.getDiagnosticClassNames(type)).toBe('DiagnosticError')
})

test('warning', () => {
  const type = 'warning'
  expect(GetDiagnosticClassName.getDiagnosticClassNames(type)).toBe('DiagnosticWarning')
})

test('unknown', () => {
  const type = 'unknown'
  expect(GetDiagnosticClassName.getDiagnosticClassNames(type)).toBe('DiagnosticError')
})
