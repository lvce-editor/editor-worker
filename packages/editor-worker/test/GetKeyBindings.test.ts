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

test('Ctrl/Cmd+Shift+K deletes the active line', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.deleteLine',
    key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyK,
    when: WhenExpression.FocusEditorText,
  })
})

test('Shift+Alt+A toggles a block comment', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.toggleBlockComment',
    key: KeyModifier.Shift | KeyModifier.Alt | KeyCode.KeyA,
    when: WhenExpression.FocusEditorText,
  })
})

test('F9 toggles a breakpoint', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.toggleBreakpoint',
    key: KeyCode.F9,
    when: WhenExpression.FocusEditorText,
  })
})

test('PageDown advances the editor viewport', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.cursorPageDown',
    key: KeyCode.PageDown,
    when: WhenExpression.FocusEditorText,
  })
})

test('Ctrl/Cmd+Shift+brackets fold and unfold', () => {
  expect(GetKeyBindings.getKeyBindings()).toEqual(
    expect.arrayContaining([
      {
        command: 'Editor.fold',
        key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.BracketLeft,
        when: WhenExpression.FocusEditorText,
      },
      {
        command: 'Editor.unfold',
        key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.BracketRight,
        when: WhenExpression.FocusEditorText,
      },
    ]),
  )
})

test('Escape closes focused editor completions', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.closeCompletion',
    key: KeyCode.Escape,
    when: WhenExpression.FocusEditorCompletions,
  })
})
