import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import type { CompletionDetailState } from '../CompletionDetailState/CompletionDetailState.ts'
import * as CompletionDetailWidgetFactory from '../CompletionDetailWidgetFactory/CompletionDetailWidgetFactory.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as GetCompletionDetailBounds from '../GetCompletionDetailBounds/GetCompletionDetailBounds.ts'
import * as GetCompletionState from '../GetCompletionState/GetCompletionState.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const openDetails = (editor: any) => {
  const child = GetCompletionState.getCompletionState(editor)
  if (!child) {
    return editor
  }
  // TODO avoid closure
  const newStateGenerator = (state: CompletionDetailState): CompletionDetailState => {
    const borderSize = 1
    const newestState: CompletionDetailState = {
      ...state,
      content: 'abc',
      ...GetCompletionDetailBounds.getCompletionDetailBounds(child, borderSize),
    }
    return newestState
  }

  return AddWidgetToEditor.addWidgetToEditor(
    WidgetId.CompletionDetail,
    FocusKey.CompletionDetail,
    editor,
    CompletionDetailWidgetFactory.create,
    newStateGenerator,
  )
}
