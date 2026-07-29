import { WidgetId } from '@lvce-editor/constants'
import type { HoverState } from '../HoverState/HoverState.ts'
import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as HasWidget from '../HasWidget/HasWidget.ts'
import * as HoverWidgetFactory from '../HoverWidgetFactory/HoverWidgetFactory.ts'
import * as LoadSignatureHelpContent from '../LoadSignatureHelpContent/LoadSignatureHelpContent.ts'
import * as RemoveEditorWidget from '../RemoveEditorWidget/RemoveEditorWidget.ts'

export const showSignatureHelp = async (editor: any): Promise<any> => {
  const { widgets = [] } = editor
  const editorWithoutHover = HasWidget.hasWidget(widgets, WidgetId.Hover)
    ? {
        ...editor,
        widgets: RemoveEditorWidget.removeEditorWidget(widgets, WidgetId.Hover),
      }
    : editor
  const newStateGenerator = async (state: HoverState): Promise<HoverState | undefined> => {
    return LoadSignatureHelpContent.loadSignatureHelpContent(state)
  }
  return AddWidgetToEditor.addWidgetToEditor(
    WidgetId.Hover,
    FocusKey.FocusEditorHover,
    editorWithoutHover,
    HoverWidgetFactory.create,
    newStateGenerator,
  )
}
