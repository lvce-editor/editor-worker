import { expect, test } from '@jest/globals'
import * as GetDiagnosticClassName from '../src/parts/GetDiagnosticClassName/GetDiagnosticClassName.ts'

test('error', () => {
  const type = 'error'
  expect(GetDiagnosticClassName.getDiagnosticClassName(type)).toBe('DiagnosticError')
})

test('warning', () => {
  const type = 'warning'
  expect(GetDiagnosticClassName.getDiagnosticClassName(type)).toBe('DiagnosticWarning')
})

test('unknown', () => {
  const type = 'unknown'
  expect(GetDiagnosticClassName.getDiagnosticClassName(type)).toBe('DiagnosticError')
})
