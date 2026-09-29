import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import * as EditorCommandQueue from '../EditorCommandQueue/EditorCommandQueue.ts'
import * as EditorState from '../EditorStates/EditorStates.ts'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
import * as ExtensionHostDiagnostic from '../ExtensionHostDiagnostic/ExtensionHostDiagnostic.ts'
import * as GetVisibleDiagnostics from '../GetVisibleDiagnostics/GetVisibleDiagnostics.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as UpdateDiagnosticsWithLinks from './UpdateDiagnosticsWithLinks.ts'

interface DiagnosticProviderMessage {
  readonly diagnostics?: readonly Diagnostic[]
  readonly providerCount?: number
  readonly providerId?: string
  readonly providerIds?: readonly string[]
  readonly providerIndex?: number
  readonly type: 'done' | 'providers' | 'result'
}

interface ProviderDiagnostics {
  readonly diagnostics: readonly Diagnostic[]
  readonly providerIndex: number
}

interface PreviousProviderResults {
  readonly languageId: string
  readonly lines: readonly string[]
  readonly providers: ReadonlyMap<string, ProviderDiagnostics>
  readonly uri: string
}

const requestGenerations = new Map<number, number>()
const previousProviderResults = new Map<number, PreviousProviderResults>()

const getDiagnostics = async (editor: any, resultPort: MessagePort): Promise<unknown> => {
  return ExtensionHostDiagnostic.streamDiagnosticProvider(editor, resultPort)
}

export const addDiagnostics = async (editor: any, diagnostics: readonly Diagnostic[]): Promise<any> => {
  const visualDecorations = await GetVisibleDiagnostics.getVisibleDiagnostics(editor, diagnostics)
  const diagnosticDecorations = visualDecorations.flatMap((decoration: any) => [
    decoration.offset,
    decoration.length,
    decoration.type,
    decoration.modifiers || 0,
  ])
  const decorations = UpdateDiagnosticsWithLinks.mergeLinksWithDiagnosticDecorations(editor, diagnosticDecorations)
  return {
    ...editor,
    decorations,
    diagnostics,
    lightBulbRowIndex: -1,
    visualDecorations,
  }
}

const handleError = async (error: unknown, editor: any): Promise<any> => {
  if (error instanceof Error && error.message.includes('No diagnostic provider found')) {
    return editor
  }
  await ErrorHandling.handleError(error, 'Failed to update diagnostics: ')
  return editor
}

const notifyDiagnosticsChange = async (uri: string, applicationId?: string): Promise<void> => {
  try {
    await ApplicationRpc.invoke(applicationId, 'Layout.handleDiagnosticsChange', uri)
  } catch {
    // Older renderer workers do not support diagnostics change listeners.
  }
}

const diagnosticsEqual = (left: readonly Diagnostic[] | undefined, right: readonly Diagnostic[]): boolean => {
  if (left === right) {
    return true
  }
  if ((left?.length ?? 0) !== right.length) {
    return false
  }
  return right.every((diagnostic, index) => {
    const other = left![index]
    return (
      other.code === diagnostic.code &&
      other.columnIndex === diagnostic.columnIndex &&
      other.endColumnIndex === diagnostic.endColumnIndex &&
      other.endRowIndex === diagnostic.endRowIndex &&
      other.message === diagnostic.message &&
      other.rowIndex === diagnostic.rowIndex &&
      other.source === diagnostic.source &&
      other.type === diagnostic.type &&
      other.uri === diagnostic.uri
    )
  })
}

const diagnosticLayoutEqual = (left: any, right: any): boolean =>
  left.charWidth === right.charWidth &&
  left.deltaY === right.deltaY &&
  left.fontFamily === right.fontFamily &&
  left.fontSize === right.fontSize &&
  left.fontWeight === right.fontWeight &&
  left.isMonospaceFont === right.isMonospaceFont &&
  left.itemHeight === right.itemHeight &&
  left.letterSpacing === right.letterSpacing &&
  left.lines === right.lines &&
  left.minLineY === right.minLineY &&
  left.rowHeight === right.rowHeight &&
  left.tabSize === right.tabSize &&
  left.viewLineIndices === right.viewLineIndices &&
  left.width === right.width

const isApplicable = (latest: any, editor: any, generation: number): boolean =>
  latest &&
  requestGenerations.get(editor.id) === generation &&
  latest.newState.diagnosticsEnabled &&
  !latest.newState.loadError &&
  latest.newState.languageId === editor.languageId &&
  latest.newState.lines === editor.lines &&
  latest.newState.uri === editor.uri

const mergeDiagnostics = (editor: any, editorWithDiagnostics: any): any => ({
  ...editor,
  decorations: editorWithDiagnostics.decorations,
  diagnostics: editorWithDiagnostics.diagnostics,
  lightBulbRowIndex: editorWithDiagnostics.lightBulbRowIndex,
  visualDecorations: editorWithDiagnostics.visualDecorations,
})

const commitDiagnostics = async (editor: any, generation: number, diagnostics: readonly Diagnostic[]): Promise<any> => {
  return (
    (await EditorCommandQueue.enqueue(editor.id, async () => {
      let latest = EditorState.get(editor.id)
      if (!isApplicable(latest, editor, generation)) {
        return editor
      }
      if (diagnosticsEqual(latest.newState.diagnostics, diagnostics)) {
        return latest.newState
      }
      let calculationState = latest.newState
      let editorWithDiagnostics = await addDiagnostics(calculationState, diagnostics)
      latest = EditorState.get(editor.id)
      while (isApplicable(latest, editor, generation) && !diagnosticLayoutEqual(calculationState, latest.newState)) {
        calculationState = latest.newState
        editorWithDiagnostics = await addDiagnostics(calculationState, diagnostics)
        latest = EditorState.get(editor.id)
      }
      if (!isApplicable(latest, editor, generation)) {
        return editor
      }
      if (diagnosticsEqual(latest.newState.diagnostics, diagnostics)) {
        return latest.newState
      }
      const newEditor = mergeDiagnostics(latest.newState, editorWithDiagnostics)
      EditorState.set(editor.id, latest.oldState, newEditor)
      await RendererWorker.invoke('Editor.renderPending', newEditor.id)
      await notifyDiagnosticsChange(newEditor.uri, newEditor.applicationId)
      return newEditor
    })) ?? editor
  )
}

const flattenProviderDiagnostics = (providers: ReadonlyMap<string, ProviderDiagnostics>): readonly Diagnostic[] => {
  return [...providers.values()]
    .toSorted((left, right) => left.providerIndex - right.providerIndex)
    .flatMap(({ diagnostics }) => diagnostics)
}

export const updateDiagnostics = async (editor: any): Promise<any> => {
  if (!editor.diagnosticsEnabled || editor.loadError) {
    return editor
  }
  const generation = (requestGenerations.get(editor.id) ?? 0) + 1
  requestGenerations.set(editor.id, generation)
  const providers = new Map<string, ProviderDiagnostics>()
  const previous = previousProviderResults.get(editor.id)
  if (previous && previous.languageId === editor.languageId && previous.lines === editor.lines && previous.uri === editor.uri) {
    for (const [providerId, result] of previous.providers) {
      providers.set(providerId, result)
    }
  }
  const { port1, port2 } = new MessageChannel()
  const completed = Promise.withResolvers<void>()
  let commitQueue = Promise.resolve()
  let providerCount = -1
  port1.onmessage = (event: MessageEvent<DiagnosticProviderMessage>): void => {
    commitQueue = commitQueue.then(async () => {
      const message = event.data
      if (requestGenerations.get(editor.id) !== generation) {
        if (message.type === 'done') {
          port1.close()
          completed.resolve()
        }
        return
      }
      if (message.type === 'providers') {
        providerCount = message.providerCount ?? 0
        const activeProviderIds = new Set(message.providerIds ?? [])
        for (const providerId of providers.keys()) {
          if (!activeProviderIds.has(providerId)) {
            providers.delete(providerId)
          } else {
            const previousResult = providers.get(providerId)!
            providers.set(providerId, {
              ...previousResult,
              providerIndex: message.providerIds!.indexOf(providerId),
            })
          }
        }
        return
      }
      if (message.type === 'result' && message.providerId !== undefined) {
        providers.set(message.providerId, {
          diagnostics: message.diagnostics ?? [],
          providerIndex: message.providerIndex ?? providers.size,
        })
        await commitDiagnostics(editor, generation, flattenProviderDiagnostics(providers))
        return
      }
      if (message.type === 'done') {
        if (providerCount === 0) {
          providers.clear()
          await commitDiagnostics(editor, generation, [])
        }
        previousProviderResults.set(editor.id, {
          languageId: editor.languageId,
          lines: editor.lines,
          providers: new Map(providers),
          uri: editor.uri,
        })
        port1.close()
        completed.resolve()
      }
    }).catch(async (error: unknown) => {
      port1.close()
      completed.resolve()
      await handleError(error, editor)
    })
  }
  port1.start()
  try {
    const response = await getDiagnostics(editor, port2)
    if (Array.isArray(response) && providerCount === -1) {
      providers.set('legacy', {
        diagnostics: response,
        providerIndex: 0,
      })
      await commitDiagnostics(editor, generation, response)
      previousProviderResults.set(editor.id, {
        languageId: editor.languageId,
        lines: editor.lines,
        providers: new Map(providers),
        uri: editor.uri,
      })
      port1.close()
      completed.resolve()
    }
    await completed.promise
    const latest = EditorState.get(editor.id)
    return isApplicable(latest, editor, generation) ? latest.newState : editor
  } catch (error) {
    port1.close()
    return handleError(error, editor)
  }
}

export const requestDiagnostics = (editor: any): any => {
  void updateDiagnostics(editor)
  return editor
}

export const clearDiagnosticRequestState = (editorId: number): void => {
  requestGenerations.delete(editorId)
  previousProviderResults.delete(editorId)
}

export const updateDiagnosticsAll = async (): Promise<void> => {
  for (const key of EditorState.getKeys()) {
    const editor = EditorState.get(Number(key))?.newState
    if (editor) {
      await updateDiagnostics(editor)
    }
  }
}
