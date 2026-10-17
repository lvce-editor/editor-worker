import { expect, test } from '@jest/globals'
import * as Diff from '../src/parts/Diff/Diff.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'

test('diff includes render widgets when widgets change', () => {
  const oldState: any = {
    widgets: [],
  }
  const newState: any = {
    widgets: [
      {
        id: 1,
      },
    ],
  }

  expect(Diff.diff(oldState, newState)).toContain(DiffType.RenderWidgets)
})
