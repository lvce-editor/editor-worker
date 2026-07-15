import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as EditorState from '../EditorStates/EditorStates.ts'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as ExtensionHostDiagnostic from '../ExtensionHostDiagnostic/ExtensionHostDiagnostic.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as GetVisibleDiagnostics from '../GetVisibleDiagnostics/GetVisibleDiagnostics.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as UpdateDiagnosticsWithLinks from './UpdateDiagnosticsWithLinks.ts'

const getDiagnostics = async (editor: any): Promise<readonly any[]> => {
  const content = TextDocument.getText(editor)
  // @ts-ignore
  await ExtensionHostWorker.invoke(ExtensionHostCommandType.TextDocumentSyncFull, editor.uri, editor.id, editor.languageId, content)
  return ExtensionHostDiagnostic.executeDiagnosticProvider(editor)
}

const addDiagnostics = async (editor: any, diagnostics: readonly any[]): Promise<any> => {
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

export const getEditorWithDiagnostics = async (editor: any): Promise<any> => {
  try {
    const diagnostics = await getDiagnostics(editor)
    if (!EditorState.get(editor.id)) {
      return editor
    }
    return addDiagnostics(editor, diagnostics)
  } catch (error) {
    return handleError(error, editor)
  }
}

export const updateDiagnostics = async (editor: any): Promise<any> => {
  try {
    const diagnostics = await getDiagnostics(editor)
    const latest = EditorState.get(editor.id)
    if (!latest) {
      return editor
    }
    const newEditor = await addDiagnostics(latest.newState, diagnostics)
    EditorState.set(editor.id, latest.oldState, newEditor)
    // @ts-ignore
    await RendererWorker.invoke('Editor.rerender', editor.id)
    return newEditor
  } catch (error) {
    return handleError(error, editor)
  }
}
