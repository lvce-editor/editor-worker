import { expect, test } from '@jest/globals'
import * as RenderAdditionalFocusContext from '../src/parts/RenderAdditionalFocusContext/RenderAdditionalFocusContext.ts'

test('renderAdditionalFocusContext sets additional focus', () => {
  const oldState = { additionalFocus: 0, uid: 1 }
  const newState = { additionalFocus: 9, uid: 1 }

  expect(RenderAdditionalFocusContext.renderAdditionalFocusContext(oldState as any, newState as any)).toEqual(['Viewlet.setAdditionalFocus', 1, 9])
})

test('renderAdditionalFocusContext removes the previous additional focus', () => {
  const oldState = { additionalFocus: 9, uid: 1 }
  const newState = { additionalFocus: 0, uid: 1 }

  expect(RenderAdditionalFocusContext.renderAdditionalFocusContext(oldState as any, newState as any)).toEqual(['Viewlet.unsetAdditionalFocus', 1, 9])
})
