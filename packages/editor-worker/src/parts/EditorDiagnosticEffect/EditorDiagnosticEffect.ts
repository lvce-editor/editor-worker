import * as UpdateDiagnostics from '../UpdateDiagnostics/UpdateDiagnostics.ts'

export const editorDiagnosticEffect = {
  // TODO set effects delay / diagnostic delay
  apply(editor: any) {
    return UpdateDiagnostics.updateDiagnostics(editor)
  },
  // TODO avoid slow comparison
  isActive: (oldEditor: any, newEditor: any) => newEditor.diagnosticsEnabled && JSON.stringify(oldEditor.lines) !== JSON.stringify(newEditor.lines),
}
