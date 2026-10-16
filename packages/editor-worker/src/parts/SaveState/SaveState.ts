import type { EditorState } from '../State/State.ts'
import * as GetWidgetHotReloadDescriptor from '../GetWidgetHotReloadDescriptor/GetWidgetHotReloadDescriptor.ts'
import * as IsPersistentWidget from '../IsPersistentWidget/IsPersistentWidget.ts'

export const saveState = async (state: EditorState, savedState: unknown): Promise<any> => {
  const { explicitLanguageId, largeFile, lines, redoStack, undoStack, widgets: stateWidgets } = state
  const widgets = []
  const widgetsToSave = stateWidgets || []
  for (const widget of widgetsToSave) {
    if (!widget?.newState || !IsPersistentWidget.isPersistentWidget(widget.id)) {
      continue
    }
    const descriptor = GetWidgetHotReloadDescriptor.getWidgetHotReloadDescriptor(widget.id)
    if (!descriptor) {
      continue
    }
    const widgetState = await descriptor.invoke(`${descriptor.name}.saveState`, widget.newState.uid)
    widgets.push({ id: widget.id, state: widgetState })
  }
  return {
    ...(explicitLanguageId && { explicitLanguageId }),
    ...(largeFile && { largeFile: true }),
    ...(widgets.length > 0 && { widgets }),
    ...((redoStack.length > 0 || undoStack.length > 0) && { lines, redoStack, undoStack }),
  }
}
