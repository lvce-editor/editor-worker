import { expect, test } from '@jest/globals'
import * as GetDiagnosticHoverDetail from '../src/parts/GetDiagnosticHoverDetail/GetDiagnosticHoverDetail.ts'

test('source and code', () => {
  expect(GetDiagnosticHoverDetail.getDiagnosticHoverDetail({ code: 'rule-a', source: 'diagnostic-test' })).toBe('diagnostic-test (rule-a)')
})

test('source only', () => {
  expect(GetDiagnosticHoverDetail.getDiagnosticHoverDetail({ source: 'Elm' })).toBe('Elm')
})

test('code only', () => {
  expect(GetDiagnosticHoverDetail.getDiagnosticHoverDetail({ code: 123 })).toBe('123')
})

test('no source or code', () => {
  expect(GetDiagnosticHoverDetail.getDiagnosticHoverDetail({})).toBe('')
})
