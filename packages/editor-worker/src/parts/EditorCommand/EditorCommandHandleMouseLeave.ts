import { WidgetId } from '@lvce-editor/constants'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as EditorHoverDismissalState from '../EditorHoverDismissalState/EditorHoverDismissalState.ts'
import * as EditorHoverState from '../EditorHoverState/EditorHoverState.ts'
import * as Editors from '../EditorStates/EditorStates.ts'
import * as RemoveEditorWidget from '../RemoveEditorWidget/RemoveEditorWidget.ts'
import * as WidgetRevision from '../WidgetRevision/WidgetRevision.ts'

const editorHoverDismissDelay = 500

export const handleMouseLeave = (viewletUid: number | string, editorUidValue?: number | string): void => {
  const targetEditorUid = editorUidValue ?? viewletUid
  const editorUid = Number(targetEditorUid)
  const instance = Editors.get(editorUid)
  if (!instance) {
    return
  }
  const { widgets = [] } = instance.newState
  EditorHoverState.clear(editorUid)
  EditorHoverDismissalState.clear(editorUid)
  const hoverWidget = widgets.find((widget: any) => widget.id === WidgetId.Hover)
  if (!hoverWidget) {
    return
  }
  const timeout = setTimeout(async () => {
    EditorHoverDismissalState.clear(editorUid)
    const latestInstance = Editors.get(editorUid)
    if (!latestInstance) {
      return
    }
    const latestEditor = latestInstance.newState
    const latestHoverWidget = latestEditor.widgets?.find((widget: any) => widget.id === WidgetId.Hover)
    if (latestHoverWidget !== hoverWidget) {
      return
    }
    const newEditor = {
      ...latestEditor,
      additionalFocus: 0,
      focused: true,
      widgetRevision: WidgetRevision.next(editorUid),
      widgets: RemoveEditorWidget.removeEditorWidget(latestEditor.widgets, WidgetId.Hover),
    }
    Editors.set(editorUid, latestEditor, newEditor)
    await RendererWorker.invoke('Editor.renderPending', editorUid)
  }, editorHoverDismissDelay)
  EditorHoverDismissalState.set(editorUid, { timeout })
}

export const handleMouseEnter = (viewletUid: number | string, editorUidValue?: number | string): void => {
  const targetEditorUid = editorUidValue ?? viewletUid
  EditorHoverDismissalState.clear(Number(targetEditorUid))
}
