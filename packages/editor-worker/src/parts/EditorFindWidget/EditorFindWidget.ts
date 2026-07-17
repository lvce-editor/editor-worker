import { WidgetId } from '@lvce-editor/constants'
import type { IFindWidget } from '../IFindWidget/IFindWidget.ts'
import type { EditorState } from '../State/State.ts'
import * as AddWidget from '../AddWidget/AddWidget.ts'
import { createFns } from '../CreateFns/CreateFns.ts'
import * as FindWidgetRender from '../FindWidgetRender/FindWidgetRender.ts'
import * as Names from '../Names/Names.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as UpdateWidget from '../UpdateWidget/UpdateWidget.ts'

const commandsToForward = [
  RenderMethod.SetDom2,
  RenderMethod.SetCss,
  RenderMethod.AppendToBody,
  RenderMethod.SetBounds2,
  RenderMethod.RegisterEventListeners,
  RenderMethod.SetSelectionByName,
  RenderMethod.SetValueByName,
  RenderMethod.SetFocusContext,
  RenderMethod.SetUid,
  'Viewlet.focusSelector',
]

export const render = (widget: IFindWidget) => {
  const commands: readonly any[] = FindWidgetRender.renderFull(widget.oldState, widget.newState)
  const wrappedCommands = []
  const { uid } = widget.newState
  for (const command of commands) {
    if (commandsToForward.includes(command[0])) {
      wrappedCommands.push(command)
    } else {
      wrappedCommands.push(['Viewlet.send', uid, ...command])
    }
  }
  return wrappedCommands
}
export const add = (widget: IFindWidget) => {
  return AddWidget.addWidget(widget, 'FindWidget', render)
}

export const remove = (widget: IFindWidget) => {
  return [['Viewlet.dispose', widget.newState.uid]]
}

export const focusFindInput = <T extends Pick<EditorState, 'widgets'>>(editor: T): T => {
  const widget = editor.widgets.find((widget: IFindWidget) => widget.id === WidgetId.Find)
  if (!widget) {
    return editor
  }
  const { uid } = widget.newState
  const newState = {
    ...widget.newState,
    commands: [[RenderMethod.FocusSelector, uid, `[name="${Names.SearchValue}"]`]],
  }
  return UpdateWidget.updateWidget(editor, WidgetId.Find, newState)
}

export const {
  close,
  focusCloseButton,
  focusFind,
  focusNext,
  focusNextElement,
  focusNextMatchButton,
  focusPrevious,
  focusPreviousElement,
  focusPreviousMatchButton,
  focusReplace,
  focusReplaceAllButton,
  focusReplaceButton,
  focusToggleReplace,
  handleBlur,
  handleClickButton,
  handleFocus,
  handleInput,
  handleReplaceFocus,
  handleReplaceInput,
  handleToggleReplaceFocus,
  replace,
  replaceAll,
  toggleMatchCase,
  toggleMatchWholeWord,
  togglePreserveCase,
  toggleReplace,
  toggleUseRegularExpression,
} = createFns(
  [
    'close',
    'focusCloseButton',
    'focusFind',
    'focusNext',
    'focusNextMatchButton',
    'focusPrevious',
    'focusPreviousMatchButton',
    'focusReplace',
    'focusReplaceAllButton',
    'focusReplaceButton',
    'focusToggleReplace',
    'handleBlur',
    'handleClickButton',
    'handleFocus',
    'handleInput',
    'handleReplaceFocus',
    'handleReplaceInput',
    'handleToggleReplaceFocus',
    'replace',
    'replaceAll',
    'toggleMatchCase',
    'toggleMatchWholeWord',
    'toggleReplace',
    'toggleUseRegularExpression',
    'focusNextElement',
    'focusPreviousElement',
    'togglePreserveCase',
  ],
  'FindWidget',
  WidgetId.Find,
)
