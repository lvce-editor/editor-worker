import * as EditorCompletion from '../EditorCompletion/EditorCompletion.ts'
import * as Editors from '../Editors/Editors.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'

export const openCompletion = async (editor: any) => {
  const { widgets, uid } = editor
  const completionWidget = {
    id: 'completion',
    oldState: {
      items: [],
      itemHeight: 20,
      maxHeight: 150,
    },
    newState: {
      items: [],
      itemHeight: 20,
      maxHeight: 150,
    },
  }
  const newWidgets = [...widgets, completionWidget]
  const newEditor = {
    ...editor,
    widgets: newWidgets,
  }
  Editors.set(uid, editor, newEditor)
  const newCompletionWidget = await EditorCompletion.loadContent(uid, completionWidget.newState)
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
