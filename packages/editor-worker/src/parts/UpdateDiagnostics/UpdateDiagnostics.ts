import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as EditorState from '../Editors/Editors.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as ExtensionHostDiagnostic from '../ExtensionHostDiagnostic/ExtensionHostDiagnostic.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as GetVisibleDiagnostics from '../GetVisibleDiagnostics/GetVisibleDiagnostics.ts'
import * as LinkDetection from '../LinkDetection/LinkDetection.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const updateDiagnostics = async (newState: any): Promise<any> => {
  try {
    // TODO handle error
    // TODO handle race condition

    // TODO sync textdocument incrementally
    // TODO sync and ask for diagnostics at the same time?
    // TODO throttle diagnostics
    const content = TextDocument.getText(newState)

    // TODO don't really need text document sync response
    // could perhaps save a lot of messages by using send instead of invoke
    // @ts-ignore
    await ExtensionHostWorker.invoke(ExtensionHostCommandType.TextDocumentSyncFull, newState.uri, newState.id, newState.languageId, content)

    const diagnostics = await ExtensionHostDiagnostic.executeDiagnosticProvider(newState)
    const latest = EditorState.get(newState.id)
    if (!latest) {
      return newState
    }
    const visualDecorations = await GetVisibleDiagnostics.getVisibleDiagnostics(latest.newState, diagnostics)
    // Re-detect link decorations after text changes
    const linkDecorations = LinkDetection.detectAllLinksAsDecorations(latest.newState)
    const newEditor = {
      ...latest.newState,
      decorations: linkDecorations, // Text-level decorations (flat array) for CSS classes
      diagnostics,
      visualDecorations, // Visual decorations (objects with x, y, width, height) for squiggly underlines
    }
    EditorState.set(newState.id, latest.oldState, newEditor)
    // @ts-ignore
    await RendererWorker.invoke('Editor.rerender', newState.id)
    return newEditor
  } catch (error) {
    // @ts-ignore
    if (error && error.message.includes('No diagnostic provider found')) {
      return newState
    }
    console.error(`Failed to update diagnostics: ${error}`)
    return newState
  }
}
