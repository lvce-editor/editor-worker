import * as EditorState from '../EditorStates/EditorStates.ts'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
import * as ExtensionHostDiagnostic from '../ExtensionHostDiagnostic/ExtensionHostDiagnostic.ts'
import * as GetVisibleDiagnostics from '../GetVisibleDiagnostics/GetVisibleDiagnostics.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as UpdateDiagnosticsWithLinks from './UpdateDiagnosticsWithLinks.ts'

const getDiagnostics = async (editor: any): Promise<readonly any[]> => {
  return ExtensionHostDiagnostic.executeDiagnosticProvider(editor)
}

export const addDiagnostics = async (editor: any, diagnostics: readonly any[]): Promise<any> => {
  const visualDecorations = await GetVisibleDiagnostics.getVisibleDiagnostics(editor, diagnostics)
  const diagnosticDecorations = visualDecorations.flatMap((decoration: any) => [
    decoration.offset,
    decoration.length,
    decoration.type,
    decoration.modifiers || 0,
  ])
  const decorations = UpdateDiagnosticsWithLinks.mergeLinksWithDiagnosticDecorations(editor, diagnosticDecorations)
  return {
    ...editor,
    decorations,
    diagnostics,
    lightBulbRowIndex: -1,
    visualDecorations,
  }
}

const handleError = async (error: unknown, editor: any): Promise<any> => {
  if (error instanceof Error && error.message.includes('No diagnostic provider found')) {
    return editor
  }
  await ErrorHandling.handleError(error, 'Failed to update diagnostics: ')
  return editor
}

const notifyDiagnosticsChange = async (uri: string): Promise<void> => {
  try {
    await RendererWorker.invoke('Layout.handleDiagnosticsChange', uri)
  } catch {
    // Older renderer workers do not support diagnostics change listeners.
  }
}

export const updateDiagnostics = async (editor: any): Promise<any> => {
  if (!editor.diagnosticsEnabled) {
    return editor
  }
  try {
    const diagnostics = await getDiagnostics(editor)
    const latest = EditorState.get(editor.id)
    if (!latest || !latest.newState.diagnosticsEnabled || latest.newState.lines !== editor.lines || latest.newState.uri !== editor.uri) {
      return editor
    }
    const newEditor = await addDiagnostics(latest.newState, diagnostics)
    EditorState.set(editor.id, latest.oldState, newEditor)
    await RendererWorker.invoke('Editor.renderPending', newEditor.id)
    await notifyDiagnosticsChange(newEditor.uri)
    return newEditor
  } catch (error) {
    return handleError(error, editor)
  }
}

export const requestDiagnostics = (editor: any): any => {
  void updateDiagnostics(editor)
  return editor
}

export const updateDiagnosticsAll = async (): Promise<void> => {
  for (const key of EditorState.getKeys()) {
    const editor = EditorState.get(Number(key))?.newState
    if (editor) {
      await updateDiagnostics(editor)
    }
  }
}
