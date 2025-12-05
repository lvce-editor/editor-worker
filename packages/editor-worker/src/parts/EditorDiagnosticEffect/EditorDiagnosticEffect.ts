import * as UpdateDiagnostics from '../UpdateDiagnostics/UpdateDiagnostics.ts'

export const editorDiagnosticEffect = {
  // TODO set effects delay / diagnostic delay
  async apply(editor: any) {
    await UpdateDiagnostics.updateDiagnostics(editor)
  },
  isActive(oldEditor: any, newEditor: any) {
    // TODO avoid slow comparison
    return newEditor.diagnosticsEnabled && JSON.stringify(oldEditor.lines) !== JSON.stringify(newEditor.lines)
  },
}
