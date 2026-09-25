import { WidgetId } from '@lvce-editor/constants'
import * as AutoSave from '../AutoSave/AutoSave.ts'
import * as ColorPickerWorker from '../ColorPickerWorker/ColorPickerWorker.ts'
import * as EditorHoverState from '../EditorHoverState/EditorHoverState.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import { notifyEditorStatusCleared } from '../NotifyEditorStatusChange/NotifyEditorStatusChange.ts'
import * as RenameWorker from '../RenameWorker/RenameWorker.ts'
import * as RenderedDoms from '../RenderedDoms/RenderedDoms.ts'
import * as RenderWidgets from '../RenderWidgets/RenderWidgets.ts'
import * as SyntaxHighlightingState from '../SyntaxHighlightingState/SyntaxHighlightingState.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'
import * as WidgetRevision from '../WidgetRevision/WidgetRevision.ts'

export const disposeEditor = async (editorUid: number): Promise<readonly any[]> => {
  const editor = EditorStates.get(editorUid)?.newState
  if (!editor) {
    return []
  }
  if (editor.lifecycle) {
    editor.lifecycle.disposed = true
    delete editor.lifecycle.sentLines
  }
  // Invalidate the registry before awaiting widget or worker cleanup.
  EditorStates.dispose(editorUid)
  RenderedDoms.dispose(editorUid)
  AutoSave.dispose(editorUid)
  EditorHoverState.clear(editorUid)
  WidgetRevision.dispose(editorUid)
  const pending: Promise<unknown>[] = []
  if (SyntaxHighlightingState.getEnabled()) {
    pending.push(SyntaxHighlightingWorker.invoke('TextDocument.dispose', editor.id))
  }
  for (const widget of editor.widgets) {
    if (widget.id === WidgetId.ColorPicker) {
      pending.push(ColorPickerWorker.invoke('ColorPicker.dispose', widget.newState.uid))
    }
  }
  const commands = RenderWidgets.renderWidgets(editor, {
    ...editor,
    widgets: [],
  })
  pending.push(RenameWorker.dispose())
  await Promise.all(pending)
  if (EditorStates.getKeys().length === 0) {
    await notifyEditorStatusCleared()
  }
  return commands
}
