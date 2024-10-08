import type { CompletionWidget } from '../CompletionWidget/CompletionWidget.ts'
import * as CompletionWidgetFactory from '../CompletionWidgetFactory/CompletionWidgetFactory.ts'
import * as EditorCompletion from '../EditorCompletion/EditorCompletion.ts'
import * as Editors from '../Editors/Editors.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as HasWidget from '../HasWidget/HasWidget.ts'
import * as SetAdditionalFocus from '../SetAdditionalFocus/SetAdditionalFocus.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const openCompletion = async (editor: any) => {
  const { widgets, uid } = editor
  if (HasWidget.hasWidget(widgets, WidgetId.Completion)) {
    return editor
  }
  const completionWidget: CompletionWidget = CompletionWidgetFactory.create()
  const newWidgets = [...widgets, completionWidget]
  const newEditor = {
    ...editor,
    widgets: newWidgets,
  }
  Editors.set(uid, editor, newEditor)
  const newCompletionWidget = await EditorCompletion.loadContent(uid, completionWidget.newState)
  const FocusEditorCompletions = FocusKey.EditorCompletion
  await SetAdditionalFocus.setAdditionalFocus(FocusEditorCompletions)
  const latestEditor = GetEditor.getEditor(uid)
  if (!latestEditor.widgets.includes(completionWidget)) {
    return editor
  }
  const index = latestEditor.widgets.indexOf(completionWidget)
  const latestWidgets = [
    ...latestEditor.widgets.slice(0, index),
    {
      ...completionWidget,
      newState: newCompletionWidget,
    },
    ...latestEditor.widgets.slice(index + 1),
  ]
  return {
    ...latestEditor,
    widgets: latestWidgets,
  }
}
