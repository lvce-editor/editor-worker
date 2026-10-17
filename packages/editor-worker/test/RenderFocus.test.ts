import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import * as RenderFocus from '../src/parts/RenderFocus/RenderFocus.ts'

test('renderFocus focuses the editor textarea when the editor is focused', () => {
  const oldState = {
    focused: false,
    uid: 1,
  }
  const newState = {
    focused: true,
    uid: 1,
  }

  expect(RenderFocus.renderFocus(oldState as any, newState as any)).toEqual([ViewletCommand.FocusSelector, 1, '.EditorInput textarea'])
})

test('renderFocus does not focus the editor textarea when a widget has full focus', () => {
  const oldState = {
    focused: true,
    uid: 1,
  }
  const newState = {
    focused: false,
    uid: 1,
  }

  expect(RenderFocus.renderFocus(oldState as any, newState as any)).toEqual([])
})
