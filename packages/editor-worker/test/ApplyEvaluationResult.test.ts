import { expect, test } from '@jest/globals'
import * as ApplyEvaluationResult from '../src/parts/ApplyEvaluationResult/ApplyEvaluationResult.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'

test('applyEvaluationResult - ignores stale results', async () => {
  const state = {
    evaluationPreviews: [
      {
        rowIndex: 0,
        value: '1',
      },
    ],
    evaluationRunId: 2,
  }
  EditorStates.set(1, state, state)

  await ApplyEvaluationResult.applyEvaluationResult(1, 1, [
    {
      rowIndex: 0,
      value: '2',
    },
  ])

  expect(EditorStates.get(1).newState.evaluationPreviews).toEqual([
    {
      rowIndex: 0,
      value: '1',
    },
  ])
})
