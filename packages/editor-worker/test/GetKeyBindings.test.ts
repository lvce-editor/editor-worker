import { expect, test } from '@jest/globals'
import { KeyCode } from '@lvce-editor/constants'
import * as GetKeyBindings from '../src/parts/GetKeyBindings/GetKeyBindings.ts'
import * as WhenExpression from '../src/parts/WhenExpression/WhenExpression.ts'

test('Escape closes the focused color picker', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.closeColorPicker',
    key: KeyCode.Escape,
    when: WhenExpression.FocusColorPicker,
  })
})

test('Escape closes focused editor completions', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.closeCompletion',
    key: KeyCode.Escape,
    when: WhenExpression.FocusEditorCompletions,
  })
})
