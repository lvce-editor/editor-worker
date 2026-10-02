import { afterEach, expect, test } from '@jest/globals'
import { ExtensionManagementWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { waitForDiagnostics } from '../src/parts/UpdateDiagnostics/UpdateDiagnostics.ts'

const editor = {
  diagnostics: [],
  diagnosticsEnabled: true,
  id: 1,
  initial: false,
  languageId: 'javascript',
  lines: ['text'],
  uri: 'file:///test.js',
}

const registerProvider = (run: (port: MessagePort) => Promise<void>): any => {
  EditorStates.set(1, editor as any, editor as any)
  const rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.streamDiagnosticProvider': async (_document: any, port: MessagePort) => run(port),
  })
  ;(rpc as any).invokeAndTransfer = (method: string, ...params: readonly unknown[]) => (rpc as any).invoke(method, ...params)
  return rpc
}

afterEach(() => {
  EditorStates.dispose(1)
})

test('waits for a delayed empty provider result and completion', async () => {
  const started = Promise.withResolvers<void>()
  const release = Promise.withResolvers<void>()
  using _provider = registerProvider(async (port) => {
    port.postMessage({ providerCount: 1, providerIds: ['slow'], type: 'providers' })
    started.resolve()
    await release.promise
    port.postMessage({ diagnostics: [], providerId: 'slow', providerIndex: 0, type: 'result' })
    port.postMessage({ type: 'done' })
  })
  let completed = false
  const waiting = waitForDiagnostics(1).then(() => {
    completed = true
  })
  await started.promise
  await new Promise<void>((resolve) => setImmediate(resolve))
  expect(completed).toBe(false)
  release.resolve()
  await waiting
  expect(completed).toBe(true)
})

test('returns only after diagnostics are committed and rendered', async () => {
  const diagnostic = { message: 'delayed diagnostic', uri: editor.uri }
  using _provider = registerProvider(async (port) => {
    port.postMessage({ providerCount: 1, providerIds: ['provider'], type: 'providers' })
    port.postMessage({ diagnostics: [diagnostic], providerId: 'provider', providerIndex: 0, type: 'result' })
    port.postMessage({ type: 'done' })
  })
  const rendering = Promise.withResolvers<void>()
  const release = Promise.withResolvers<void>()
  using _renderer = RendererWorker.registerMockRpc({
    'Editor.renderPending': async () => {
      rendering.resolve()
      await release.promise
    },
    'Layout.handleDiagnosticsChange': async () => undefined,
  })
  let completed = false
  const waiting = waitForDiagnostics(1).then(() => {
    completed = true
  })
  await rendering.promise
  expect(completed).toBe(false)
  release.resolve()
  await waiting
  expect(EditorStates.get(1).newState.diagnostics).toEqual([diagnostic])
})

test('rejects provider failures instead of treating them as empty results', async () => {
  using _provider = registerProvider(async (port) => {
    port.postMessage({ providerCount: 1, providerIds: ['broken'], type: 'providers' })
    port.postMessage({ diagnostics: [], error: 'unavailable', providerId: 'broken', type: 'result' })
    port.postMessage({ type: 'done' })
  })
  await expect(waitForDiagnostics(1)).rejects.toThrow('Diagnostic provider broken failed: unavailable')
})

test('times out even when the provider RPC never returns', async () => {
  const release = Promise.withResolvers<void>()
  using _provider = registerProvider(async () => release.promise)
  try {
    await expect(waitForDiagnostics(1, 20)).rejects.toThrow('Diagnostics timed out')
  } finally {
    release.resolve()
  }
})

test('rejects a truncated stream', async () => {
  using _provider = registerProvider(async (port) => {
    port.postMessage({ providerCount: 1, providerIds: ['missing'], type: 'providers' })
    port.postMessage({ type: 'done' })
  })
  await expect(waitForDiagnostics(1)).rejects.toThrow('without all provider results')
})

test('zero providers completes successfully', async () => {
  using _provider = registerProvider(async (port) => {
    port.postMessage({ providerCount: 0, providerIds: [], type: 'providers' })
    port.postMessage({ type: 'done' })
  })
  await expect(waitForDiagnostics(1)).resolves.toBeUndefined()
})

test('rejects a closed editor and invalid timeout', async () => {
  await expect(waitForDiagnostics(1)).rejects.toThrow('Editor is not ready')
  await expect(waitForDiagnostics(1, 0)).rejects.toThrow('Diagnostics timeout')
})
