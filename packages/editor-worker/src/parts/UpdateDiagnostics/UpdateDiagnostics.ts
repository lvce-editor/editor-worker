import * as EditorState from '../Editors/Editors.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as ExtensionHostDiagnostic from '../ExtensionHostDiagnostic/ExtensionHostDiagnostic.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as GetVisibleDiagnostics from '../GetVisibleDiagnostics/GetVisibleDiagnostics.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const updateDiagnostics = async (newState: any): Promise<void> => {
  try {
    // TODO handle error
    // TODO handle race condition

    // TODO sync textdocument incrementally
    // TODO sync and ask for diagnostics at the same time?
    // TODO throttle diagnostics
    const content = TextDocument.getText(newState)

    // TODO don't really need text document sync response
    // could perhaps save a lot of messages by using send instead of invoke
    await ExtensionHostWorker.invoke(ExtensionHostCommandType.TextDocumentSyncFull, newState.uri, newState.id, newState.languageId, content)

    const diagnostics = await ExtensionHostDiagnostic.executeDiagnosticProvider(newState)
    const latest = EditorState.get(newState.id)
    if (!latest) {
      return
    }
    const decorations = GetVisibleDiagnostics.getVisibleDiagnostics(latest.newState, diagnostics)
    const newEditor = {
      ...latest.newState,
      diagnostics,
      decorations,
    }
    EditorState.set(newState.id, latest.oldState, newEditor)
    await RendererWorker.invoke('Editor.rerender', newState.id)
  } catch (error) {
    // @ts-ignore
    if (error && error.message.includes('No diagnostic provider found')) {
      return
    }
    console.error(`Failed to update diagnostics: ${error}`)
  }
}
