import * as FindWidgetWorkerCallbacks from '../FindWidgetWorkerCallbacks/FindWidgetWorkerCallbacks.ts'

export const getFindWidgetWorkerCommandMap = (): Record<string, (...args: readonly any[]) => any> => ({
  'Editor.applyDocumentEdits': FindWidgetWorkerCallbacks.applyDocumentEdits,
  'Editor.closeFind2': FindWidgetWorkerCallbacks.closeFind,
  'Editor.getLines2': FindWidgetWorkerCallbacks.getLines,
  'Editor.getSelections2': FindWidgetWorkerCallbacks.getSelections,
  'Editor.setSelections2': FindWidgetWorkerCallbacks.setSelections,
})
