import { expect, test } from '@jest/globals'
import * as Diff from '../src/parts/Diff/Diff.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'

test('diff includes additional focus context changes', () => {
  const oldState = {
    additionalFocus: 0,
  }
  const newState = {
    additionalFocus: 9,
  }

  expect(Diff.diff(oldState as any, newState as any)).toContain(DiffType.RenderAdditionalFocusContext)
})
