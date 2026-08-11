import type { EditorState } from '../State/State.ts'
import * as UpdateDiagnostics from '../UpdateDiagnostics/UpdateDiagnostics.ts'

export const editorDiagnosticEffect = {
  // TODO set effects delay / diagnostic delay
  apply(editor: any) {
    return UpdateDiagnostics.updateDiagnostics(editor)
  },
  isActive: (oldEditor: EditorState, newEditor: EditorState) => newEditor.diagnosticsEnabled && oldEditor.lines !== newEditor.lines,
}
