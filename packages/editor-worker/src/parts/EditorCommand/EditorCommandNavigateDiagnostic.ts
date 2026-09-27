import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import * as Editor from '../Editor/Editor.ts'
import * as GetDiagnosticNavigationIndex from '../GetDiagnosticNavigationIndex/GetDiagnosticNavigationIndex.ts'
import * as EditorCommandShowHover from './EditorCommandShowHover.ts'

const navigateDiagnostic = async (editor: any, direction: 1 | -1): Promise<any> => {
  const { diagnostics = [], problemNavigationDiagnostic, selections } = editor
  const result = GetDiagnosticNavigationIndex.getDiagnosticNavigationIndex(
    diagnostics,
    selections,
    problemNavigationDiagnostic as Diagnostic | undefined,
    direction,
  )
  if (!result) {
    return editor
  }
  const { diagnostic } = result
  const newSelections = new Uint32Array([diagnostic.rowIndex, diagnostic.columnIndex, diagnostic.endRowIndex, diagnostic.endColumnIndex])
  const editorWithSelection = Editor.scheduleSelections(editor, newSelections)
  const editorWithNavigationState = {
    ...editorWithSelection,
    problemNavigationDiagnostic: diagnostic,
  }
  return EditorCommandShowHover.showDiagnostic(editorWithNavigationState, diagnostic)
}

export const nextDiagnostic = (editor: any): Promise<any> => {
  return navigateDiagnostic(editor, 1)
}

export const previousDiagnostic = (editor: any): Promise<any> => {
  return navigateDiagnostic(editor, -1)
}
