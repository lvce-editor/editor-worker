import { expect, test } from '@jest/globals'
import { diagnosticContainsPosition } from '../src/parts/DiagnosticContainsPosition/DiagnosticContainsPosition.ts'

const diagnostic = {
  code: 1,
  columnIndex: 4,
  endColumnIndex: 8,
  endRowIndex: 2,
  message: 'Problem',
  rowIndex: 2,
  source: 'test',
  type: 'error',
  uri: 'file:///test.ts',
}

test('uses half-open bounds for non-empty diagnostics', () => {
  expect(diagnosticContainsPosition(diagnostic, 2, 4)).toBe(true)
  expect(diagnosticContainsPosition(diagnostic, 2, 7)).toBe(true)
  expect(diagnosticContainsPosition(diagnostic, 2, 8)).toBe(false)
})

test('matches an empty diagnostic only at its exact position', () => {
  const emptyDiagnostic = {
    ...diagnostic,
    endColumnIndex: 4,
  }
  expect(diagnosticContainsPosition(emptyDiagnostic, 2, 4)).toBe(true)
  expect(diagnosticContainsPosition(emptyDiagnostic, 2, 3)).toBe(false)
  expect(diagnosticContainsPosition(emptyDiagnostic, 2, 5)).toBe(false)
})
