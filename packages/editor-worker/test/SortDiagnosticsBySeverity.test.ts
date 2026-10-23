import { expect, test } from '@jest/globals'
import { sortDiagnosticsBySeverity } from '../src/parts/SortDiagnosticsBySeverity/SortDiagnosticsBySeverity.ts'

test('sorts warnings before errors without mutating the input', () => {
  const diagnostics = [{ type: 'error' }, { type: 'warning' }, { type: 'error' }]

  expect(sortDiagnosticsBySeverity(diagnostics)).toEqual([{ type: 'warning' }, { type: 'error' }, { type: 'error' }])
  expect(diagnostics).toEqual([{ type: 'error' }, { type: 'warning' }, { type: 'error' }])
})
