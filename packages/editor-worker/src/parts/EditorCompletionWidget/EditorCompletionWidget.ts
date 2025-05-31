import type { CompletionWidget } from '../CompletionWidget/CompletionWidget.ts'
import * as AddWidget from '../AddWidget/AddWidget.ts'
import * as CompletionWorker from '../CompletionWorker/CompletionWorker.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as RenderRename from '../RenderRename/RenderRename.ts'

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
  const fn = async (editor: any, state: any) => {
    const { uid } = state
    await CompletionWorker.invoke(`Completions.${key}`, uid)
    const diff = await CompletionWorker.invoke('Completions.diff2', uid)
    const commands = await CompletionWorker.invoke('Completions.render2', uid, diff)
    return {
      ...state,
      commands,
    }
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
])

// 'EditorCompletion.advance': EditorCompletion.advance,
// 'EditorCompletion.closeDetails': EditorCompletionCloseDetails.closeDetails,
// 'EditorCompletion.focusFirst': EditorCompletionFocusFirst.focusFirst,
// 'EditorCompletion.focusIndex': EditorCompletionFocusIndex.focusIndex,
// 'EditorCompletion.focusNext': EditorCompletionFocusNext.focusNext,
// 'EditorCompletion.focusPrevious': EditorCompletionFocusPrevious.focusPrevious,
// 'EditorCompletion.handleEditorBlur': EditorCompletion.handleEditorBlur,
// 'EditorCompletion.handleEditorClick': EditorCompletion.handleEditorClick,
// 'EditorCompletion.handleEditorDeleteLeft': EditorCompletion.handleEditorDeleteLeft,
// 'EditorCompletion.handleEditorType': EditorCompletion.handleEditorType,
// 'EditorCompletion.handleWheel': EditorCompletionHandleWheel.handleWheel,
// 'EditorCompletion.loadContent': EditorCompletion.loadContent,
// 'EditorCompletion.openDetails': EditorCompletionOpenDetails.openDetails,
// 'EditorCompletion.selectCurrent': EditorCompletionSelectCurrent.selectCurrent,
// 'EditorCompletion.selectIndex': EditorCompletionSelectIndex.selectIndex,
// 'EditorCompletion.toggleDetails': EditorCompletionToggleDetails.toggleDetails,
