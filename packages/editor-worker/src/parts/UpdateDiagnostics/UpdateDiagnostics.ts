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
  readonly error?: string
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
  readonly providers: ReadonlyMap<string, ProviderDiagnostics>
  readonly uri: string
}

const requestGenerations = new Map<number, number>()
const requestDiagnosticSnapshots = new Map<number, readonly Diagnostic[]>()
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
  latest.newState.diagnostics === requestDiagnosticSnapshots.get(editor.id) &&
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

const commitDiagnostics = async (editor: any, generation: number, diagnostics: readonly Diagnostic[], onAccepted?: () => void): Promise<any> => {
  return (
    (await EditorCommandQueue.enqueue(editor.id, async () => {
      let latest = EditorState.get(editor.id)
      if (!isApplicable(latest, editor, generation)) {
        return editor
      }
      if (diagnosticsEqual(latest.newState.diagnostics, diagnostics)) {
        onAccepted?.()
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
      requestDiagnosticSnapshots.set(editor.id, diagnostics)
      onAccepted?.()
      await RendererWorker.invoke('Editor.renderPending', newEditor.id)
      await notifyDiagnosticsChange(newEditor.uri, newEditor.applicationId)
      return newEditor
    })) ?? editor
  )
}

const flattenProviderDiagnostics = (providers: ReadonlyMap<string, ProviderDiagnostics>): readonly Diagnostic[] => {
  return providers
    .values()
    .toArray()
    .toSorted((left, right) => left.providerIndex - right.providerIndex)
    .flatMap(({ diagnostics }) => diagnostics)
}

const saveProviderResults = (editor: any, providers: ReadonlyMap<string, ProviderDiagnostics>): void => {
  previousProviderResults.set(editor.id, {
    languageId: editor.languageId,
    providers: new Map(providers),
    uri: editor.uri,
  })
}

export const updateDiagnostics = async (editor: any, timeoutMs = 0): Promise<any> => {
  const strict = timeoutMs > 0
  if (strict && editor.loadError) {
    throw new Error(`Cannot await diagnostics: ${editor.loadError}`)
  }
  if (!editor.diagnosticsEnabled || editor.loadError) {
    return editor
  }
  const generation = (requestGenerations.get(editor.id) ?? 0) + 1
  requestGenerations.set(editor.id, generation)
  requestDiagnosticSnapshots.set(editor.id, EditorState.get(editor.id)?.newState.diagnostics ?? editor.diagnostics)
  const providers = new Map<string, ProviderDiagnostics>()
  const previous = previousProviderResults.get(editor.id)
  if (previous && previous.languageId === editor.languageId && previous.uri === editor.uri) {
    for (const [providerId, result] of previous.providers) {
      providers.set(providerId, result)
    }
  }
  const { port1, port2 } = new MessageChannel()
  const completed = Promise.withResolvers<void>()
  let commitQueue = Promise.resolve()
  let providerCount = -1
  let finished = false
  const receivedProviders = new Set<string>()
  const timeout = strict
    ? setTimeout(() => completed.reject(new Error(`Diagnostics timed out after ${timeoutMs}ms for ${editor.uri}`)), timeoutMs)
    : undefined
  port1.onmessage = (event: MessageEvent<DiagnosticProviderMessage>): void => {
    const previousCommit = commitQueue
    commitQueue = (async () => {
      await previousCommit
      try {
        if (finished) {
          return
        }
        const message = event.data
        if (requestGenerations.get(editor.id) !== generation) {
          if (strict) {
            throw new Error('Diagnostics request was superseded')
          }
          if (message.type === 'done') {
            port1.close()
            completed.resolve()
          }
          return
        }
        if (message.type === 'providers') {
          providerCount = message.providerCount ?? 0
          const providerIds = message.providerIds ?? []
          for (const providerId of providers.keys()) {
            if (providerIds.includes(providerId)) {
              const previousResult = providers.get(providerId)!
              providers.set(providerId, {
                ...previousResult,
                providerIndex: providerIds.indexOf(providerId),
              })
            } else {
              providers.delete(providerId)
            }
          }
          if (requestGenerations.get(editor.id) === generation) {
            saveProviderResults(editor, providers)
          }
          return
        }
        if (message.type === 'result' && message.providerId !== undefined) {
          if (strict && message.error !== undefined) {
            throw new Error(`Diagnostic provider ${message.providerId} failed: ${message.error}`)
          }
          receivedProviders.add(message.providerId)
          providers.set(message.providerId, {
            diagnostics: message.diagnostics ?? [],
            providerIndex: message.providerIndex ?? providers.size,
          })
          await commitDiagnostics(editor, generation, flattenProviderDiagnostics(providers), () => saveProviderResults(editor, providers))
          return
        }
        if (message.type === 'done') {
          if (strict && (providerCount < 0 || receivedProviders.size !== providerCount)) {
            throw new Error('Diagnostics stream ended without all provider results')
          }
          if (providerCount === 0) {
            providers.clear()
            await commitDiagnostics(editor, generation, [], () => saveProviderResults(editor, providers))
          }
          if (requestGenerations.get(editor.id) === generation) {
            saveProviderResults(editor, providers)
          }
          port1.close()
          completed.resolve()
        }
      } catch (error) {
        port1.close()
        if (strict) {
          completed.reject(error)
        } else {
          completed.resolve()
          await handleError(error, editor)
        }
      }
    })()
  }
  port1.start()
  const request = async (): Promise<void> => {
    const response = await getDiagnostics(editor, port2)
    if (finished) {
      return
    }
    if (Array.isArray(response) && providerCount === -1) {
      if (strict) {
        throw new Error('Diagnostic provider does not support completion and error reporting')
      }
      providers.set('legacy', {
        diagnostics: response,
        providerIndex: 0,
      })
      await commitDiagnostics(editor, generation, response, () => saveProviderResults(editor, providers))
      port1.close()
      completed.resolve()
    }
  }
  try {
    await Promise.all([request(), completed.promise])
    const latest = EditorState.get(editor.id)
    if (strict && !isApplicable(latest, editor, generation)) {
      throw new Error('Editor changed or closed while waiting for diagnostics')
    }
    return isApplicable(latest, editor, generation) ? latest.newState : editor
  } catch (error) {
    if (strict) {
      if (requestGenerations.get(editor.id) === generation) {
        requestGenerations.set(editor.id, generation + 1)
      }
      throw error
    }
    return handleError(error, editor)
  } finally {
    finished = true
    clearTimeout(timeout)
    port1.close()
    port2.close()
  }
}

export const requestDiagnostics = (editor: any): any => {
  void updateDiagnostics(editor)
  return editor
}

export const clearDiagnosticRequestState = (editorId: number): void => {
  requestGenerations.delete(editorId)
  requestDiagnosticSnapshots.delete(editorId)
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

// Do not wrap this command in EditorCommandQueue: streamed results need that queue to commit.
export const waitForDiagnostics = async (editorId: number, timeoutMs = 30_000): Promise<void> => {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || timeoutMs > 300_000) {
    throw new Error('Diagnostics timeout must be between 1 and 300000ms')
  }
  const editor = EditorState.get(editorId)?.newState
  if (!editor || editor.initial) {
    throw new Error(`Editor is not ready: ${editorId}`)
  }
  await updateDiagnostics(editor, timeoutMs)
}
