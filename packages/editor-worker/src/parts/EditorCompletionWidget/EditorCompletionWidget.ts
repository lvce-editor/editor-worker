import type { CompletionWidget } from '../CompletionWidget/CompletionWidget.ts'
import * as AddWidget from '../AddWidget/AddWidget.ts'
import * as CompletionWorker from '../CompletionWorker/CompletionWorker.ts'
import * as Editors from '../Editors/Editors.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as RenderRename from '../RenderRename/RenderRename.ts'
import * as UpdateWidget from '../UpdateWidget/UpdateWidget.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const render = (widget: CompletionWidget) => {
  const commands: readonly any[] = RenderRename.renderFull(widget.oldState, widget.newState)
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

export const add = (widget: CompletionWidget) => {
  return AddWidget.addWidget(widget, 'EditorRename', render)
}

export const remove = (widget: CompletionWidget) => {
  return [['Viewlet.dispose', widget.newState.uid]]
}

const createFn = (key: string) => {
  const widgetId = WidgetId.Completion
  const isWidget = (widget: any) => {
    return widget.id === widgetId
  }
  const fn = async (editor: any, ...args: readonly any[]) => {
    const childIndex = editor.widgets.findIndex(isWidget)
    // TODO scroll up/down if necessary
    const childWidget = editor.widgets[childIndex]
    const state = childWidget.newState
    const { uid } = state
    await CompletionWorker.invoke(`Completions.${key}`, uid, ...args)
    const diff = await CompletionWorker.invoke('Completions.diff2', uid)
    const commands = await CompletionWorker.invoke('Completions.render2', uid, diff)
    const newState = {
      ...state,
      commands,
    }
    const latest = Editors.get(editor.uid).newState
    const newEditor = UpdateWidget.updateWidget(latest, widgetId, newState)
    return newEditor
  }
  return fn
}

const createFns = (keys: readonly string[]): any => {
  const fns = Object.create(null)
  for (const key of keys) {
    fns[key] = createFn(key)
  }
  return fns
}

export const {
  focusFirst,
  focusIndex,
  focusLast,
  focusNext,
  focusPrevious,
  handleEditorBlur,
  handleEditorClick,
  handleEditorDeleteLeft,
  handleEditorType,
  openDetails,
  selectCurrent,
  selectIndex,
  toggleDetails,
  closeDetails,
  handleWheel,
  close,
} = createFns([
  'handleEditorType',
  'focusFirst',
  'focusNext',
  'focusPrevious',
  'focusLast',
  'handleEditorDeleteLeft',
  'openDetails',
  'focusIndex',
  'handleEditorBlur',
  'handleEditorClick',
  'openDetails',
  'selectCurrent',
  'selectIndex',
  'toggleDetails',
  'closeDetails',
  'handleWheel',
  'close',
])
