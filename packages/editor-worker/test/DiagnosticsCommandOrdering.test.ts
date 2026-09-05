import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import { ExtensionManagementWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'

const updateDerivedState = jest.fn(async (_oldState: any, newState: any) => newState)

jest.unstable_mockModule('../src/parts/UpdateDerivedState/UpdateDerivedState.ts', () => ({
  updateDerivedState,
}))

const { wrapCommand } = await import('../src/parts/WrapCommands/WrapCommands.ts')
const { updateDiagnostics } = await import('../src/parts/UpdateDiagnostics/UpdateDiagnostics.ts')

beforeEach(() => {
  updateDerivedState.mockImplementation(async (_oldState: any, newState: any) => newState)
})

afterEach(() => {
  EditorStates.dispose(1)
})

test('diagnostics completing during a layout command are not overwritten by its stale snapshot', async () => {
  const entered = Promise.withResolvers<void>()
  const finishLayout = Promise.withResolvers<void>()
  updateDerivedState.mockImplementation(async (_oldState: any, newState: any) => {
    entered.resolve()
    await finishLayout.promise
    return newState
  })
  const diagnostic = { message: 'delayed diagnostic', uri: 'file:///main.ts' }
  using _extensionRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeDiagnosticProvider': async () => [diagnostic],
  })
  using _rendererRpc = RendererWorker.registerMockRpc({
    'Editor.renderPending': async () => undefined,
    'Layout.handleDiagnosticsChange': async () => undefined,
  })
  const editor = {
    deltaY: 0,
    diagnostics: [],
    diagnosticsEnabled: true,
    id: 1,
    initial: false,
    languageId: 'typescript',
    lines: ['text'],
    uid: 1,
    uri: 'file:///main.ts',
  }
  EditorStates.set(1, editor as any, editor as any)
  const scroll = wrapCommand((state: any) => ({ ...state, deltaY: 800 }))
  const scrolling = scroll(1)
  await entered.promise
  const diagnostics = updateDiagnostics(editor)
  await new Promise<void>((resolve) => setImmediate(resolve))
  finishLayout.resolve()
  await Promise.all([scrolling, diagnostics])

  expect(EditorStates.get(1).newState.deltaY).toBe(800)
  expect(EditorStates.get(1).newState.diagnostics).toEqual([diagnostic])
})

test('waiting for a diagnostics provider does not block editor commands', async () => {
  const requested = Promise.withResolvers<void>()
  const provider = Promise.withResolvers<readonly any[]>()
  using _extensionRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeDiagnosticProvider': async () => {
      requested.resolve()
      return provider.promise
    },
  })
  const editor = {
    deltaY: 0,
    diagnostics: [],
    diagnosticsEnabled: true,
    id: 1,
    languageId: 'typescript',
    lines: ['text'],
    uid: 1,
    uri: 'file:///main.ts',
  }
  EditorStates.set(1, editor as any, editor as any)
  const diagnostics = updateDiagnostics(editor)
  await requested.promise
  const scroll = wrapCommand((state: any) => ({ ...state, deltaY: 800 }))
  await scroll(1)
  expect(EditorStates.get(1).newState.deltaY).toBe(800)
  provider.resolve([])
  await diagnostics
})

test('a queued provider result does not overwrite diagnostics set by a newer command', async () => {
  const entered = Promise.withResolvers<void>()
  const finishCommand = Promise.withResolvers<void>()
  updateDerivedState.mockImplementation(async (_oldState: any, newState: any) => {
    entered.resolve()
    await finishCommand.promise
    return newState
  })
  using _extensionRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeDiagnosticProvider': async () => [],
  })
  using _rendererRpc = RendererWorker.registerMockRpc({
    'Editor.renderPending': async () => undefined,
    'Layout.handleDiagnosticsChange': async () => undefined,
  })
  const editor = {
    diagnostics: [],
    diagnosticsEnabled: true,
    id: 1,
    languageId: 'typescript',
    lines: ['text'],
    uid: 1,
    uri: 'file:///main.ts',
  }
  EditorStates.set(1, editor as any, editor as any)
  const manualDiagnostics = [{ message: 'explicit diagnostic', uri: editor.uri }]
  const setDiagnostics = wrapCommand((state: any) => ({ ...state, diagnostics: manualDiagnostics }))
  const settingDiagnostics = setDiagnostics(1)
  await entered.promise
  const pendingProvider = updateDiagnostics(editor)
  await new Promise<void>((resolve) => setImmediate(resolve))
  finishCommand.resolve()
  await Promise.all([settingDiagnostics, pendingProvider])

  expect(EditorStates.get(1).newState.diagnostics).toBe(manualDiagnostics)
})
