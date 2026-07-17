import { expect, test } from '@jest/globals'
import { KeyCode, KeyModifier } from '@lvce-editor/constants'
import * as GetKeyBindings from '../src/parts/GetKeyBindings/GetKeyBindings.ts'
import * as WhenExpression from '../src/parts/WhenExpression/WhenExpression.ts'

test('Escape closes the focused color picker', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.closeColorPicker',
    key: KeyCode.Escape,
    when: WhenExpression.FocusColorPicker,
  })
})

test('Ctrl/Cmd+Alt+Up adds a cursor above', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.addCursorAbove',
    key: KeyModifier.CtrlCmd | KeyModifier.Alt | KeyCode.UpArrow,
    when: WhenExpression.FocusEditorText,
  })
})

test('Ctrl/Cmd+Alt+Down adds a cursor below', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.addCursorBelow',
    key: KeyModifier.CtrlCmd | KeyModifier.Alt | KeyCode.DownArrow,
    when: WhenExpression.FocusEditorText,
  })
})

test('Escape closes focused editor completions', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.closeCompletion',
    key: KeyCode.Escape,
    when: WhenExpression.FocusEditorCompletions,
  })
})
