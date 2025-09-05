import { WidgetId } from '@lvce-editor/constants'
import type { IFindWidget } from '../IFindWidget/IFindWidget.ts'
import * as AddWidget from '../AddWidget/AddWidget.ts'
import { createFns } from '../CreateFns/CreateFns.ts'
import * as FindWidgetRender from '../FindWidgetRender/FindWidgetRender.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'

export const render = (widget: IFindWidget) => {
  const commands: readonly any[] = FindWidgetRender.renderFull(widget.oldState, widget.newState)
  const wrappedCommands = []
  const { uid } = widget.newState
  for (const command of commands) {
    if (
      command[0] === RenderMethod.SetDom2 ||
      command[0] === RenderMethod.SetCss ||
      command[0] === RenderMethod.AppendToBody ||
      command[0] === RenderMethod.SetBounds2 ||
      command[0] === RenderMethod.RegisterEventListeners ||
      command[0] === RenderMethod.SetSelectionByName ||
      command[0] === RenderMethod.SetValueByName ||
      command[0] === RenderMethod.SetFocusContext ||
      command[0] === RenderMethod.SetUid ||
      command[0] === 'Viewlet.focusSelector'
    ) {
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

export const {
  close,
  focusCloseButton,
  focusFind,
  focusNext,
  focusNextMatchButton,
  focusPrevious,
  focusPreviousMatchButton,
  focusReplace,
  focusReplaceAllButton,
  focusReplaceButton,
  focusToggleReplace,
  handleBlur,
  handleFocus,
  handleInput,
  handleReplaceFocus,
  handleReplaceInput,
  handleToggleReplaceFocus,
  toggleReplace,
  toggleMatchCase,
  replace,
  replaceAll,
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
    'handleFocus',
    'handleInput',
    'handleReplaceFocus',
    'handleReplaceInput',
    'handleToggleReplaceFocus',
    'toggleReplace',
    'toggleMatchCase',
    'replace',
    'replaceAll',
  ],
  'FindWidget',
  WidgetId.Find,
)
