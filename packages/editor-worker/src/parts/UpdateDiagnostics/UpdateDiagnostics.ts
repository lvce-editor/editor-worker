import * as EditorState from '../Editors/Editors.ts'
import * as ExtensionHostDiagnostic from '../ExtensionHostDiagnostic/ExtensionHostDiagnostic.ts'

export const updateDiagnostics = async (uid: number): Promise<void> => {
  // TODO handle error
  // TODO handle race condition
  const { newState } = EditorState.get(uid)
  // TODO request diagnostics from extension host
  const diagnostics = await ExtensionHostDiagnostic.executeDiagnosticProvider(newState)
  console.log({ diagnostics })
  // TODO inform renderer worker to rerender?
  console.log({ newState })
}
