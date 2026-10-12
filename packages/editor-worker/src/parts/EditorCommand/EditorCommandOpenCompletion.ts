import { WidgetId } from '@lvce-editor/constants'
import type { CompletionState } from '../CompletionState/CompletionState.ts'
import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as CompletionWidgetFactory from '../CompletionWidgetFactory/CompletionWidgetFactory.ts'
import * as CompletionWorker from '../CompletionWorker/CompletionWorker.ts'
import * as Editors from '../EditorStates/EditorStates.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as UpdateWidget from '../UpdateWidget/UpdateWidget.ts'
import { closeCompletion } from './EditorCommandCloseCompletion.ts'

const disposeCompletion = async (uid: number): Promise<void> => {
  try {
    await CompletionWorker.invoke('Completions.dispose', uid)
  } catch {
    // A completion worker may already have disposed this state during shutdown.
  }
}

const newStateGenerator = async (
  state: CompletionState,
  parentUid: number,
  markCreated: () => void,
  automatic: boolean,
): Promise<CompletionState | undefined> => {
  const { height, uid, width, x, y } = state
  const { newState } = Editors.get(parentUid)
  const { applicationId, languageId } = newState
  await CompletionWorker.invoke('Completions.create', uid, x, y, width, height, parentUid, languageId, applicationId)
  markCreated()
  await CompletionWorker.invoke('Completions.loadContent', uid, automatic)
  if (automatic && !(await CompletionWorker.invoke('Completions.hasItems', uid))) {
    return undefined
  }
  const diff = await CompletionWorker.invoke('Completions.diff2', uid)
  const commands = await CompletionWorker.invoke('Completions.render2', uid, diff)
  return {
    ...state,
    automatic,
    commands,
  }
}

export const openCompletion = async (editor: any, automatic = false) => {
  const widget = (editor.widgets || []).find((candidate: any) => candidate.id === WidgetId.Completion)
  if (widget && (automatic || widget.newState.automatic)) {
    const { uid } = widget.newState
    await CompletionWorker.invoke('Completions.loadContent', uid, automatic)
    if (Editors.get(editor.uid)?.newState !== editor) {
      return Editors.get(editor.uid)?.newState || editor
    }
    if (automatic && !(await CompletionWorker.invoke('Completions.hasItems', uid))) {
      return closeCompletion(editor)
    }
    const diff = await CompletionWorker.invoke('Completions.diff2', uid)
    const commands = await CompletionWorker.invoke('Completions.render2', uid, diff)
    return UpdateWidget.updateWidget(editor, WidgetId.Completion, { ...widget.newState, automatic, commands })
  }
  let completionUid = 0
  let created = false
  const generateState = async (state: CompletionState, parentUid: number): Promise<CompletionState | undefined> => {
    completionUid = state.uid
    try {
      const result = await newStateGenerator(
        state,
        parentUid,
        () => {
          created = true
        },
        automatic,
      )
      return result
    } catch (error) {
      if (created) {
        await disposeCompletion(completionUid)
      }
      throw error
    }
  }
  const fullFocus = false
  const result = await AddWidgetToEditor.addWidgetToEditor(
    WidgetId.Completion,
    FocusKey.EditorCompletion,
    editor,
    CompletionWidgetFactory.create,
    generateState,
    fullFocus,
  )
  const wasAdded = (result?.widgets || []).some((widget: any) => widget.id === WidgetId.Completion && widget.newState.uid === completionUid)
  const currentEditor = Editors.get(editor.uid)?.newState
  if (created && (!wasAdded || currentEditor !== editor)) {
    await disposeCompletion(completionUid)
  }
  return result
}
