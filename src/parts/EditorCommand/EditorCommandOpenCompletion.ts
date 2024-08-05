import * as EditorCompletion from '../EditorCompletion/EditorCompletion.ts'
import * as Editors from '../Editors/Editors.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const openCompletion = async (editor: any) => {
  const { widgets, uid } = editor
  const completionUid = Math.random()
  const completionWidget = {
    id: WidgetId.Completion,
    oldState: {
      items: [],
      itemHeight: 20,
      maxHeight: 150,
      minLineY: 0,
      maxLineY: 0,
      uid: completionUid,
    },
    newState: {
      items: [],
      itemHeight: 20,
      maxHeight: 150,
      minLineY: 0,
      maxLineY: 10,
      uid: completionUid,
    },
  }
  const newWidgets = [...widgets, completionWidget]
  const newEditor = {
    ...editor,
    widgets: newWidgets,
  }
  Editors.set(uid, editor, newEditor)
  const newCompletionWidget = await EditorCompletion.loadContent(uid, completionWidget.newState)
  const FocusEditorCompletions = 9
  await RendererWorker.invoke('Focus.setAdditionalFocus', FocusEditorCompletions)
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
