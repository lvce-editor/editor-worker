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
  EditorStates.dispose(2)
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

test('serializes commands for editors showing the same uri', async () => {
  const firstState = {
    initial: false,
    lines: [''],
    modified: false,
    redoStack: [],
    text: '',
    uid: 1,
    undoStack: [],
    uri: 'file:///same.txt',
  }
  const secondState = {
    ...firstState,
    uid: 2,
  }
  EditorStates.set(1, firstState as any, firstState as any)
  EditorStates.set(2, secondState as any, secondState as any)
  const order: string[] = []
  const command = WrapCommands.wrapCommand(async (state: any, label: string) => {
    order.push(`start-${label}`)
    await Promise.resolve()
    order.push(`end-${label}`)
    return {
      ...state,
      text: state.text + label,
    }
  })

  await Promise.all([command(1, 'left'), command(2, 'right')])

  expect(order).toEqual(['start-left', 'end-left', 'start-right', 'end-right'])
})

test('synchronizes document state with another editor showing the same uri', async () => {
  const firstState = {
    decorations: [],
    diagnostics: [],
    incrementalEdits: [],
    initial: false,
    invalidStartIndex: 0,
    lines: ['abc'],
    modified: false,
    redoStack: [],
    uid: 1,
    undoStack: [],
    uri: 'file:///same.txt',
    visualDecorations: [],
  }
  const secondState = {
    ...firstState,
    focused: true,
    uid: 2,
  }
  EditorStates.set(1, firstState as any, firstState as any)
  EditorStates.set(2, secondState as any, secondState as any)
  const edit = [{ inserted: ['x'] }]
  const command = WrapCommands.wrapCommand((state: any) => ({
    ...state,
    lines: ['abcx'],
    modified: true,
    undoStack: [edit],
  }))

  await command(1)

  expect(EditorStates.get(2).newState).toMatchObject({
    focused: true,
    lines: ['abcx'],
    modified: true,
    undoStack: [edit],
  })
})

test('does not synchronize document state with another uri', async () => {
  const firstState = {
    initial: false,
    lines: ['abc'],
    modified: false,
    redoStack: [],
    uid: 1,
    undoStack: [],
    uri: 'file:///one.txt',
  }
  const secondState = {
    ...firstState,
    uid: 2,
    uri: 'file:///two.txt',
  }
  EditorStates.set(1, firstState as any, firstState as any)
  EditorStates.set(2, secondState as any, secondState as any)
  const command = WrapCommands.wrapCommand((state: any) => ({
    ...state,
    lines: ['abcx'],
  }))

  await command(1)

  expect(EditorStates.get(2).newState).toBe(secondState)
})
