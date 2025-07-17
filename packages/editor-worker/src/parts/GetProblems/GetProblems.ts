import type { Problem } from '../Problem/Problem.ts'
import * as Editors from '../Editors/Editors.ts'
import * as ExtensionHostDiagnostic from '../ExtensionHostDiagnostic/ExtensionHostDiagnostic.ts'

const getDiagnostics = (editor: any): Promise<any> => {
  return ExtensionHostDiagnostic.executeDiagnosticProvider(editor)
}

export const getProblems = async (): Promise<readonly Problem[]> => {
  // TODO maybe combine querying diagnostics for problems view with diagnostics for editor
  // or query the diagnostics for the problems view directtly from the extension host worker
  const keys = Editors.getKeys()
  const editors = keys.map((key) => {
    const numericKey = parseInt(key)
    const editor = Editors.get(numericKey)
    return editor
  })
  const newEditors = editors.map((editor) => editor.newState)
  const diagnostics = await Promise.all(newEditors.map(getDiagnostics))
  const flatDiagnostics = diagnostics.flat()
  return flatDiagnostics
}
