import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

const updateDerivedStateMock = jest.fn()
const editorDiagnosticEffectApplyMock: any = jest.fn()
const editorDiagnosticEffectIsActiveMock: any = jest.fn()

jest.unstable_mockModule('../src/parts/UpdateDerivedState/UpdateDerivedState.ts', () => ({
  updateDerivedState: updateDerivedStateMock,
}))

jest.unstable_mockModule('../src/parts/EditorDiagnosticEffect/EditorDiagnosticEffect.ts', () => ({
  editorDiagnosticEffect: {
    apply: editorDiagnosticEffectApplyMock,
    isActive: editorDiagnosticEffectIsActiveMock,
  },
}))

const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const WrapCommands = await import('../src/parts/WrapCommands/WrapCommands.ts')

beforeEach(() => {
  const state = {
    text: '',
  }
  EditorStates.set(1, state as any, state as any)
  editorDiagnosticEffectApplyMock.mockReset()
  editorDiagnosticEffectApplyMock.mockImplementation(async (newState: any) => newState)
  editorDiagnosticEffectIsActiveMock.mockReset()
  editorDiagnosticEffectIsActiveMock.mockReturnValue(false)
  updateDerivedStateMock.mockReset()
  updateDerivedStateMock.mockImplementation(async (_oldState, newState) => {
    await Promise.resolve()
    return newState
  })
})

afterEach(() => {
  EditorStates.dispose(1)
})

test('serializes concurrent commands for the same editor', async () => {
  const command = WrapCommands.wrapCommand((state: any, text: string) => ({
    ...state,
    text: state.text + text,
  }))

  await Promise.all([command(1, 'a'), command(1, 'b'), command(1, 'c')])

  expect((EditorStates.get(1).newState as any).text).toBe('abc')
})

test('applies diagnostics after a command changes the editor text', async () => {
  const oldState = {
    diagnosticsEnabled: true,
    lines: [''],
  }
  const newState = {
    diagnosticsEnabled: true,
    lines: ['x'],
  }
  const stateWithDiagnostics = {
    ...newState,
    diagnostics: [{ message: 'error' }],
  }
  EditorStates.set(1, oldState as any, oldState as any)
  editorDiagnosticEffectIsActiveMock.mockReturnValue(true)
  editorDiagnosticEffectApplyMock.mockResolvedValue(stateWithDiagnostics)
  const command = WrapCommands.wrapCommand(() => newState)

  const result = await command(1)

  expect(editorDiagnosticEffectIsActiveMock).toHaveBeenCalledWith(oldState, newState)
  expect(editorDiagnosticEffectApplyMock).toHaveBeenCalledWith(newState)
  expect(result).toBe(stateWithDiagnostics)
  expect(EditorStates.get(1).newState).toBe(stateWithDiagnostics)
})
