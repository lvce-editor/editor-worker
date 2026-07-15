import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import * as RenderFocusContext from '../src/parts/RenderFocusContext/RenderFocusContext.ts'

test('renderFocusContext', () => {
  const oldState = { focus: 12, uid: 1 }
  const newState = { focus: 41, uid: 1 }
  expect(RenderFocusContext.renderFocusContext(oldState as any, newState as any)).toEqual([ViewletCommand.SetFocusContext, 1, 41])
})
