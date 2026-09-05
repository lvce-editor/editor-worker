import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import * as EditorState from '../EditorStates/EditorStates.ts'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
import * as ExtensionHostDiagnostic from '../ExtensionHostDiagnostic/ExtensionHostDiagnostic.ts'
import * as GetVisibleDiagnostics from '../GetVisibleDiagnostics/GetVisibleDiagnostics.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as UpdateDiagnosticsWithLinks from './UpdateDiagnosticsWithLinks.ts'

const getDiagnostics = async (editor: any): Promise<readonly Diagnostic[]> => {
  return ExtensionHostDiagnostic.executeDiagnosticProvider(editor)
}

export const addDiagnostics = async (editor: any, diagnostics: readonly Diagnostic[]): Promise<any> => {
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

const notifyDiagnosticsChange = async (uri: string, applicationId?: string): Promise<void> => {
  try {
    await ApplicationRpc.invoke(applicationId, 'Layout.handleDiagnosticsChange', uri)
  } catch {
    // Older renderer workers do not support diagnostics change listeners.
  }
}

const diagnosticsEqual = (left: readonly Diagnostic[] | undefined, right: readonly Diagnostic[]): boolean => {
  if (left === right) {
    return true
  }
  if ((left?.length ?? 0) !== right.length) {
    return false
  }
  return right.every((diagnostic, index) => {
    const other = left![index]
    return (
      other.code === diagnostic.code &&
      other.columnIndex === diagnostic.columnIndex &&
      other.endColumnIndex === diagnostic.endColumnIndex &&
      other.endRowIndex === diagnostic.endRowIndex &&
      other.message === diagnostic.message &&
      other.rowIndex === diagnostic.rowIndex &&
      other.source === diagnostic.source &&
      other.type === diagnostic.type &&
      other.uri === diagnostic.uri
    )
  })
}

const diagnosticLayoutEqual = (left: any, right: any): boolean =>
  left.charWidth === right.charWidth &&
  left.deltaY === right.deltaY &&
  left.fontFamily === right.fontFamily &&
  left.fontSize === right.fontSize &&
  left.fontWeight === right.fontWeight &&
  left.isMonospaceFont === right.isMonospaceFont &&
  left.itemHeight === right.itemHeight &&
  left.letterSpacing === right.letterSpacing &&
  left.lines === right.lines &&
  left.minLineY === right.minLineY &&
  left.rowHeight === right.rowHeight &&
  left.tabSize === right.tabSize &&
  left.viewLineIndices === right.viewLineIndices &&
  left.width === right.width

const isApplicable = (latest: any, editor: any): boolean =>
  latest && latest.newState.diagnosticsEnabled && latest.newState.lines === editor.lines && latest.newState.uri === editor.uri

const mergeDiagnostics = (editor: any, editorWithDiagnostics: any): any => ({
  ...editor,
  decorations: editorWithDiagnostics.decorations,
  diagnostics: editorWithDiagnostics.diagnostics,
  lightBulbRowIndex: editorWithDiagnostics.lightBulbRowIndex,
  visualDecorations: editorWithDiagnostics.visualDecorations,
})

export const updateDiagnostics = async (editor: any): Promise<any> => {
  if (!editor.diagnosticsEnabled) {
    return editor
  }
  try {
    const diagnostics = await getDiagnostics(editor)
    let latest = EditorState.get(editor.id)
    if (!isApplicable(latest, editor)) {
      return editor
    }
    if (diagnosticsEqual(latest.newState.diagnostics, diagnostics)) {
      return latest.newState
    }
    let calculationState = latest.newState
    let editorWithDiagnostics = await addDiagnostics(calculationState, diagnostics)
    latest = EditorState.get(editor.id)
    while (isApplicable(latest, editor) && !diagnosticLayoutEqual(calculationState, latest.newState)) {
      calculationState = latest.newState
      editorWithDiagnostics = await addDiagnostics(calculationState, diagnostics)
      latest = EditorState.get(editor.id)
    }
    if (!isApplicable(latest, editor)) {
      return editor
    }
    if (diagnosticsEqual(latest.newState.diagnostics, diagnostics)) {
      return latest.newState
    }
    const newEditor = mergeDiagnostics(latest.newState, editorWithDiagnostics)
    EditorState.set(editor.id, latest.oldState, newEditor)
    await RendererWorker.invoke('Editor.renderPending', newEditor.id)
    await notifyDiagnosticsChange(newEditor.uri, newEditor.applicationId)
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
