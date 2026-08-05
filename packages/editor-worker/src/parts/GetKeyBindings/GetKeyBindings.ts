import { KeyModifier, KeyCode } from '@lvce-editor/constants'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'

const findWidgetFocusContexts = [
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

const getFindWidgetFocusKeyBindings = () => {
  return findWidgetFocusContexts.flatMap((focusContext) => [
    {
      command: 'FindWidget.focusNextElement',
      key: KeyCode.Tab,
      when: focusContext,
    },
    {
      command: 'FindWidget.focusPreviousElement',
      key: KeyModifier.Shift | KeyCode.Tab,
      when: focusContext,
    },
  ])
}

export const getKeyBindings = () => {
  return [
    {
      command: 'Editor.closeColorPicker',
      key: KeyCode.Escape,
      when: WhenExpression.FocusColorPicker,
    },
    {
      command: 'Editor.cancelSelection',
      key: KeyCode.Escape,
      when: FocusKey.FocusEditorHover,
    },
    {
      command: 'Editor.closeSourceAction',
      key: KeyCode.Escape,
      when: WhenExpression.FocusSourceActions,
    },
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
    {
      command: 'FindWidget.replace',
      key: KeyCode.Enter,
      when: WhenExpression.FocusFindWidgetReplace,
    },
    {
      command: 'FindWidget.focusNext',
      key: KeyCode.Enter,
      when: WhenExpression.FocusFindWidget,
    },
    {
      command: 'FindWidget.focusPrevious',
      key: KeyModifier.Shift | KeyCode.Enter,
      when: WhenExpression.FocusFindWidget,
    },
    {
      command: 'FindWidget.preventDefaultBrowserFind',
      key: KeyModifier.CtrlCmd | KeyCode.KeyF,
      when: WhenExpression.FocusFindWidget,
    },
    {
      command: 'FindWidget.focusPrevious',
      key: KeyModifier.Shift | KeyCode.F4,
      when: WhenExpression.FocusFindWidget,
    },
    {
      command: 'FindWidget.focusNext',
      key: KeyCode.F4,
      when: WhenExpression.FocusFindWidget,
    },
    ...getFindWidgetFocusKeyBindings(),
    {
      command: 'FindWidget.replaceAll',
      key: KeyModifier.Alt | KeyModifier.CtrlCmd | KeyCode.Enter,
      when: WhenExpression.FocusFindWidgetReplace,
    },
    {
      command: 'EditorCompletion.focusNext',
      key: KeyCode.DownArrow,
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      command: 'EditorCompletion.focusPrevious',
      key: KeyCode.UpArrow,
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      command: 'EditorCompletion.selectCurrent',
      key: KeyCode.Enter,
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      command: 'Editor.closeCompletion',
      key: KeyCode.Escape,
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      command: 'EditorCompletion.focusLast',
      key: KeyCode.End,
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      command: 'EditorCompletion.focusFirst',
      key: KeyCode.Home,
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      command: 'EditorCompletion.toggleDetails',
      key: KeyModifier.CtrlCmd | KeyCode.Space,
      when: WhenExpression.FocusEditorCompletions,
    },
    {
      command: 'Editor.cursorWordRight',
      key: KeyModifier.CtrlCmd | KeyCode.RightArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorWordLeft',
      key: KeyModifier.CtrlCmd | KeyCode.LeftArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorDocumentEnd',
      key: KeyModifier.CtrlCmd | KeyCode.End,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorDocumentStart',
      key: KeyModifier.CtrlCmd | KeyCode.Home,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.deleteWordPartLeft',
      key: KeyModifier.Alt | KeyCode.Backspace,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.deleteWordPartRight',
      key: KeyModifier.Alt | KeyCode.Delete,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.deleteWordLeft',
      key: KeyModifier.CtrlCmd | KeyCode.Backspace,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.deleteWordRight',
      key: KeyModifier.CtrlCmd | KeyCode.Delete,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.selectNextOccurrence',
      key: KeyModifier.CtrlCmd | KeyCode.KeyD,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.openColorPicker',
      key: KeyModifier.CtrlCmd | KeyCode.KeyJ,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.showSourceActions3',
      key: KeyModifier.CtrlCmd | KeyCode.Period,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.handleTab',
      key: KeyCode.Tab,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.unindent',
      key: KeyModifier.Shift | KeyCode.Tab,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.indentLess',
      key: KeyModifier.CtrlCmd | KeyCode.BracketLeft,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.fold',
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.BracketLeft,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.closeFind',
      key: KeyCode.Escape,
      when: WhenExpression.FocusFindWidget,
    },
    {
      command: 'Editor.openFind2',
      key: KeyModifier.CtrlCmd | KeyCode.KeyF,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.openCodeGenerator',
      key: KeyModifier.CtrlCmd | KeyCode.KeyK,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.closeCodeGenerator',
      key: KeyCode.Escape,
      when: WhenExpression.FocusEditorCodeGenerator,
    },
    {
      command: 'EditorCodeGenerator.accept',
      key: KeyCode.Enter,
      when: WhenExpression.FocusEditorCodeGenerator,
    },
    {
      command: 'Editor.indentMore',
      key: KeyModifier.CtrlCmd | KeyCode.BracketRight,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.unfold',
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.BracketRight,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.selectCharacterLeft',
      key: KeyModifier.Shift | KeyCode.LeftArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.selectWordLeft',
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.LeftArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.selectCharacterRight',
      key: KeyModifier.Shift | KeyCode.RightArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.selectWordRight',
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.RightArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.selectLine',
      key: KeyModifier.CtrlCmd | KeyCode.KeyL,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.deleteAllLeft',
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.Backspace,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.deleteAllRight',
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.Delete,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.deleteLine',
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyK,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cancelSelection',
      key: KeyCode.Escape,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.undo',
      key: KeyModifier.CtrlCmd | KeyCode.KeyZ,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorLeft',
      key: KeyCode.LeftArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorRight',
      key: KeyCode.RightArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorUp',
      key: KeyCode.UpArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorDown',
      key: KeyCode.DownArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorPageDown',
      key: KeyCode.PageDown,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.deleteLeft',
      key: KeyCode.Backspace,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.deleteRight',
      key: KeyCode.Delete,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.insertLineBreak',
      key: KeyCode.Enter,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.copyLineDown',
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyD,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.moveLineDown',
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.DownArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.moveLineUp',
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.UpArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.openCompletion',
      key: KeyModifier.CtrlCmd | KeyCode.Space,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.openRename',
      key: KeyCode.F2,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.toggleBreakpoint',
      key: KeyCode.F9,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.goToDefinition',
      key: KeyCode.F12,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'EditorRename.accept',
      key: KeyCode.Enter,
      when: WhenExpression.FocusEditorRename,
    },
    {
      command: 'Editor.closeRename',
      key: KeyCode.Escape,
      when: WhenExpression.FocusEditorRename,
    },
    {
      command: 'Editor.cursorHome',
      key: KeyCode.Home,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorEnd',
      key: KeyCode.End,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.toggleComment',
      key: KeyModifier.CtrlCmd | KeyCode.Slash,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.toggleBlockComment',
      key: KeyModifier.Alt | KeyModifier.Shift | KeyCode.KeyA,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.copy',
      key: KeyModifier.CtrlCmd | KeyCode.KeyC,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.selectAll',
      key: KeyModifier.CtrlCmd | KeyCode.KeyA,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.showHover',
      key: KeyModifier.CtrlCmd | KeyCode.KeyH,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cut',
      key: KeyModifier.CtrlCmd | KeyCode.KeyX,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.paste',
      key: KeyModifier.CtrlCmd | KeyCode.KeyV,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorWordPartLeft',
      key: KeyModifier.Alt | KeyCode.LeftArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorWordPartRight',
      key: KeyModifier.Alt | KeyCode.RightArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.selectAllOccurrences',
      key: KeyModifier.Alt | KeyCode.F3,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.addCursorAbove',
      key: KeyModifier.Alt | KeyModifier.CtrlCmd | KeyCode.UpArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.addCursorBelow',
      key: KeyModifier.Alt | KeyModifier.CtrlCmd | KeyCode.DownArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.findAllReferences',
      key: KeyModifier.Shift | KeyCode.F12,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.organizeImports',
      key: KeyModifier.Alt | KeyModifier.Shift | KeyCode.KeyO,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.selectionGrow',
      key: KeyModifier.Alt | KeyModifier.Shift | KeyCode.RightArrow,
      when: WhenExpression.FocusEditor,
    },
    {
      command: 'Editor.showSignatureHelp',
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.Space,
      when: WhenExpression.FocusEditorText,
    },
  ]
}
