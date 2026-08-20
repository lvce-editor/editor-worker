import { WidgetId } from '@lvce-editor/constants'
import type { HoverState } from '../HoverState/HoverState.ts'
import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as GetDiagnosticHoverInfo from '../GetDiagnosticHoverInfo/GetDiagnosticHoverInfo.ts'
import * as HoverWidgetFactory from '../HoverWidgetFactory/HoverWidgetFactory.ts'
import * as LoadHoverContent from '../LoadHoverContent/LoadHoverContent.ts'
import * as RemoveEditorWidget from '../RemoveEditorWidget/RemoveEditorWidget.ts'
import * as UpdateWidget from '../UpdateWidget/UpdateWidget.ts'
import * as WidgetRevision from '../WidgetRevision/WidgetRevision.ts'

const getHoverWidgetIndex = (widgets: readonly any[]): number => {
  return widgets.findIndex((widget) => widget.id === WidgetId.Hover)
}

const applyHoverContent = async (editor: any, getNewState: (state: HoverState) => Promise<HoverState | undefined>): Promise<any> => {
  const { widgets = [] } = editor
  const widgetIndex = getHoverWidgetIndex(widgets)
  if (widgetIndex === -1) {
    return AddWidgetToEditor.addWidgetToEditor(WidgetId.Hover, FocusKey.FocusEditorHover, editor, HoverWidgetFactory.create, getNewState)
  }
  const widgetRevision = WidgetRevision.next(editor.uid)
  const widget = widgets[widgetIndex]
  const newState = await getNewState(widget.newState)
  if (WidgetRevision.get(editor.uid) !== widgetRevision) {
    return editor
  }
  if (!newState) {
    return {
      ...editor,
      additionalFocus: FocusKey.Empty,
      focused: true,
      widgetRevision,
      widgets: RemoveEditorWidget.removeEditorWidget(editor.widgets, WidgetId.Hover),
    }
  }
  return {
    ...UpdateWidget.updateWidget(editor, WidgetId.Hover, newState),
    widgetRevision,
  }
}

export const showHover = async (editor: any, position?: any): Promise<any> => {
  const newStateGenerator = async (state: HoverState): Promise<HoverState | undefined> => {
    return LoadHoverContent.loadHoverContent(state, position)
  }
  return applyHoverContent(editor, newStateGenerator)
}

export const showDiagnostic = async (editor: any, diagnostic: any): Promise<any> => {
  const newStateGenerator = async (state: HoverState): Promise<HoverState> => {
    const hoverInfo = await GetDiagnosticHoverInfo.getDiagnosticHoverInfo(editor, diagnostic)
    return {
      ...state,
      ...hoverInfo,
    }
  }
  return applyHoverContent(editor, newStateGenerator)
}
