import * as EditorState from '../Editors/Editors.ts'
import * as ExtensionHostDiagnostic from '../ExtensionHostDiagnostic/ExtensionHostDiagnostic.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const updateDiagnostics = async (uid: number): Promise<void> => {
  try {
    // TODO handle error
    // TODO handle race condition
    const { newState } = EditorState.get(uid)
    // TODO request diagnostics from extension host
    const diagnostics = await ExtensionHostDiagnostic.executeDiagnosticProvider(newState)
    const latest = EditorState.get(uid)
    if (!latest) {
      return
    }
    const newEditor = {
      ...latest.newState,
      diagnostics,
    }
    EditorState.set(uid, latest.oldState, newEditor)
    await RendererWorker.invoke('Editor.rerender', uid)
  } catch (error) {
    console.error(`Failed to updated diagnostics: ${error}`)
  }
}
