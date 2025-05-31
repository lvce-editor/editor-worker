import type { CompletionState } from '../CompletionState/CompletionState.ts'
import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as CompletionWidgetFactory from '../CompletionWidgetFactory/CompletionWidgetFactory.ts'
import * as CompletionWorker from '../CompletionWorker/CompletionWorker.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

const newStateGenerator = async (state: CompletionState, parentUid: number): Promise<CompletionState> => {
  const { uid, x, y, width, height } = state
  await CompletionWorker.invoke('Completions.create', uid, x, y, width, height, parentUid)
  await CompletionWorker.invoke('Completions.loadContent', uid)
  const diff = await CompletionWorker.invoke('Completions.diff2', uid)
  const commands = await CompletionWorker.invoke('Completions.render2', uid, diff)
  return {
    ...state,
    commands,
  }
}

export const openCompletion = async (editor: any) => {
  console.log('open completion')
  const fullFocus = false
  return AddWidgetToEditor.addWidgetToEditor(
    WidgetId.Completion,
    FocusKey.EditorCompletion,
    editor,
    CompletionWidgetFactory.create,
    newStateGenerator,
    fullFocus,
  )
}
