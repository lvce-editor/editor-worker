import { expect, test } from '@jest/globals'
import { KeyCode, KeyModifier } from '@lvce-editor/constants'
import * as FocusKey from '../src/parts/FocusKey/FocusKey.ts'
import * as GetKeyBindings from '../src/parts/GetKeyBindings/GetKeyBindings.ts'
import * as WhenExpression from '../src/parts/WhenExpression/WhenExpression.ts'

test('Escape closes the focused color picker', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.closeColorPicker',
    key: KeyCode.Escape,
    when: WhenExpression.FocusColorPicker,
  })
})

test('source action keybindings use the editor source action widget commands', () => {
  expect(GetKeyBindings.getKeyBindings()).toEqual(
    expect.arrayContaining([
      {
        command: 'EditorSourceAction.focusNext',
        key: KeyCode.DownArrow,
        when: WhenExpression.FocusSourceActions,
      },
      {
        command: 'EditorSourceAction.focusPrevious',
        key: KeyCode.UpArrow,
        when: WhenExpression.FocusSourceActions,
      },
      {
        command: 'EditorSourceAction.focusFirst',
        key: KeyCode.Home,
        when: WhenExpression.FocusSourceActions,
      },
      {
        command: 'EditorSourceAction.focusLast',
        key: KeyCode.End,
        when: WhenExpression.FocusSourceActions,
      },
      {
        command: 'EditorSourceAction.selectCurrent',
        key: KeyCode.Enter,
        when: WhenExpression.FocusSourceActions,
      },
    ]),
  )
})

test('Shift+Enter focuses the previous find match', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'FindWidget.focusPrevious',
    key: KeyModifier.Shift | KeyCode.Enter,
    when: WhenExpression.FocusFindWidget,
  })
})

test('Enter replaces the current find match from the replace input', () => {
  const keyBindings = GetKeyBindings.getKeyBindings()
  const replace = {
    command: 'FindWidget.replace',
    key: KeyCode.Enter,
    when: WhenExpression.FocusFindWidgetReplace,
  }
  const focusNext = {
    command: 'FindWidget.focusNext',
    key: KeyCode.Enter,
    when: WhenExpression.FocusFindWidget,
  }
  expect(keyBindings).toContainEqual(replace)
  const replaceIndex = keyBindings.findIndex(
    (keyBinding) => keyBinding.command === replace.command && keyBinding.key === replace.key && keyBinding.when === replace.when,
  )
  const focusNextIndex = keyBindings.findIndex(
    (keyBinding) => keyBinding.command === focusNext.command && keyBinding.key === focusNext.key && keyBinding.when === focusNext.when,
  )
  expect(replaceIndex).toBeLessThan(focusNextIndex)
})

test('Tab and Shift+Tab traverse every find widget control', () => {
  const keyBindings = GetKeyBindings.getKeyBindings()
  const focusContexts = [
    FocusKey.FindWidget,
    FocusKey.FocusFindWidgetReplace,
    FocusKey.FocusFindWidgetOptions,
    FocusKey.FocusFindWidgetToggleReplace,
    FocusKey.FocusFindWidgetPreviousMatchButton,
    FocusKey.FocusFindWidgetNextMatchButton,
    FocusKey.FocusFindWidgetCloseButton,
    FocusKey.FocusFindWidgetReplaceButton,
    FocusKey.FocusFindWidgetReplaceAllButton,
  ]

  for (const focusContext of focusContexts) {
    expect(keyBindings).toContainEqual({
      command: 'FindWidget.focusNextElement',
      key: KeyCode.Tab,
      when: focusContext,
    })
    expect(keyBindings).toContainEqual({
      command: 'FindWidget.focusPreviousElement',
      key: KeyModifier.Shift | KeyCode.Tab,
      when: focusContext,
    })
  }
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

test('Ctrl/Cmd+Shift+Up moves lines up', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.moveLineUp',
    key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.UpArrow,
    when: WhenExpression.FocusEditorText,
  })
})

test('Ctrl/Cmd+Shift+Down moves lines down', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.moveLineDown',
    key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.DownArrow,
    when: WhenExpression.FocusEditorText,
  })
})

test('Ctrl/Cmd+Shift+Z and Ctrl/Cmd+Y redo the last edit', () => {
  expect(GetKeyBindings.getKeyBindings()).toEqual(
    expect.arrayContaining([
      {
        command: 'Editor.redo',
        key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyZ,
        when: WhenExpression.FocusEditorText,
      },
      {
        command: 'Editor.redo',
        key: KeyModifier.CtrlCmd | KeyCode.KeyY,
        when: WhenExpression.FocusEditorText,
      },
    ]),
  )
})

test('Ctrl/Cmd+U restores the last cursor operation', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.cursorUndo',
    key: KeyModifier.CtrlCmd | KeyCode.KeyU,
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

test('Ctrl/Cmd+Home and Ctrl/Cmd+End move to document boundaries', () => {
  expect(GetKeyBindings.getKeyBindings()).toEqual(
    expect.arrayContaining([
      {
        command: 'Editor.cursorDocumentStart',
        key: KeyModifier.CtrlCmd | KeyCode.Home,
        when: WhenExpression.FocusEditorText,
      },
      {
        command: 'Editor.cursorDocumentEnd',
        key: KeyModifier.CtrlCmd | KeyCode.End,
        when: WhenExpression.FocusEditorText,
      },
    ]),
  )
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

test('F12 goes to definition', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.goToDefinition',
    key: KeyCode.F12,
    when: WhenExpression.FocusEditorText,
  })
})

test('Shift+F12 finds all references', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.findAllReferences',
    key: KeyModifier.Shift | KeyCode.F12,
    when: WhenExpression.FocusEditorText,
  })
})

test('Ctrl/Cmd+Shift+Space shows signature help', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.showSignatureHelp',
    key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.Space,
    when: WhenExpression.FocusEditorText,
  })
})

test('Ctrl/Cmd+H shows hover', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.showHover',
    key: KeyModifier.CtrlCmd | KeyCode.KeyH,
    when: WhenExpression.FocusEditorText,
  })
})

test('Shift+Alt+Right grows the selection', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.selectionGrow',
    key: KeyModifier.Shift | KeyModifier.Alt | KeyCode.RightArrow,
    when: WhenExpression.FocusEditor,
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

test('Escape dismisses the editor hover', () => {
  expect(GetKeyBindings.getKeyBindings()).toContainEqual({
    command: 'Editor.cancelSelection',
    key: KeyCode.Escape,
    when: FocusKey.FocusEditorHover,
  })
})
