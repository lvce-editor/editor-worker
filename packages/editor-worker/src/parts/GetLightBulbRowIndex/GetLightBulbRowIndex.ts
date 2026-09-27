import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import type { EditorState } from '../State/State.ts'
import * as ApplicationExtensionRpc from '../ApplicationExtensionRpc/ApplicationExtensionRpc.ts'
import { diagnosticContainsPosition } from '../DiagnosticContainsPosition/DiagnosticContainsPosition.ts'
import * as GetOffsetAtCursor from '../GetOffsetAtCursor/GetOffsetAtCursor.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

const hasDiagnosticAtPosition = (diagnostics: readonly Diagnostic[], rowIndex: number, columnIndex: number): boolean =>
  diagnostics.some((diagnostic) => diagnosticContainsPosition(diagnostic, rowIndex, columnIndex))

export const getLightBulbRowIndex = async (editor: EditorState): Promise<number> => {
  const { diagnostics = [], languageId, selections, uri } = editor
  if (!selections || selections.length !== 4 || selections[0] !== selections[2] || selections[1] !== selections[3]) {
    return -1
  }
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  if (!hasDiagnosticAtPosition(diagnostics, rowIndex, columnIndex)) {
    return -1
  }
  const textDocument = {
    documentId: editor.uid,
    languageId,
    text: TextDocument.getText(editor),
    uri,
  }
  const offset = GetOffsetAtCursor.getOffsetAtCursor(editor)
  try {
    const actions = await ApplicationExtensionRpc.invoke(editor.applicationId, 'Extensions.executeCodeActionProviders', textDocument, offset)
    return Array.isArray(actions) && actions.length > 0 ? rowIndex : -1
  } catch {
    return -1
  }
}
