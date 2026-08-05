import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

const updateDerivedStateMock = jest.fn()
const editorDiagnosticEffectApplyMock: any = jest.fn()
const editorDiagnosticEffectIsActiveMock: any = jest.fn()
const autoSaveScheduleMock = jest.fn<(uid: number, save: (token: number) => Promise<void>) => void>()
const autoSaveIsLatestMock = jest.fn<(uid: number, token: number) => boolean>()
const autoSaveConsumeMock = jest.fn<(uid: number, token: number) => void>()
const autoSaveDisposeMock = jest.fn<(uid: number) => void>()
const saveMock = jest.fn()
const getPreferenceMock = jest.fn<(key: string) => Promise<string>>()
const rendererInvokeMock = jest.fn()

jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({
  RendererWorker: {
    invoke: rendererInvokeMock,
  },
}))

jest.unstable_mockModule('../src/parts/AutoSave/AutoSave.ts', () => ({
  consume: autoSaveConsumeMock,
  dispose: autoSaveDisposeMock,
  isLatest: autoSaveIsLatestMock,
  schedule: autoSaveScheduleMock,
}))

jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandSave.ts', () => ({
  save: saveMock,
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.ts', () => ({
  get: getPreferenceMock,
}))

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
  autoSaveScheduleMock.mockReset()
  autoSaveIsLatestMock.mockReset()
  autoSaveIsLatestMock.mockReturnValue(true)
  autoSaveConsumeMock.mockReset()
  autoSaveDisposeMock.mockReset()
  saveMock.mockReset()
  saveMock.mockImplementation(async (editor: any) => ({
    ...editor,
    modified: false,
  }))
  getPreferenceMock.mockReset()
  getPreferenceMock.mockResolvedValue('afterDelay')
  rendererInvokeMock.mockReset()
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

test('breaks typing coalescing for other commands', async () => {
  const state = {
    canCoalesceTyping: true,
    initial: false,
    lines: ['abc'],
    modified: true,
    redoStack: [],
    uid: 1,
    undoStack: [],
    uri: 'file:///one.txt',
  }
  EditorStates.set(1, state as any, state as any)
  const command = WrapCommands.wrapCommand((editor: any) => editor)

  const result = await command(1)

  expect(result.canCoalesceTyping).toBe(false)
})

test('preserves typing coalescing for typing commands', async () => {
  const state = {
    canCoalesceTyping: true,
    initial: false,
    lines: ['abc'],
    modified: true,
    redoStack: [],
    uid: 1,
    undoStack: [],
    uri: 'file:///one.txt',
  }
  EditorStates.set(1, state as any, state as any)
  const command = WrapCommands.wrapCommand((editor: any) => editor, true)

  const result = await command(1)

  expect(result.canCoalesceTyping).toBe(true)
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
  expect(autoSaveScheduleMock).toHaveBeenCalledWith(1, expect.any(Function))
})

test('schedules auto save when undo changes a modified document', async () => {
  const state = {
    initial: false,
    lines: ['edited'],
    modified: true,
    redoStack: [],
    uid: 1,
    undoStack: [[{ inserted: ['edited'] }]],
    uri: 'file:///one.txt',
  }
  EditorStates.set(1, state as any, state as any)
  const command = WrapCommands.wrapCommand((editor: any) => ({
    ...editor,
    lines: ['original'],
    redoStack: editor.undoStack,
    undoStack: [],
  }))

  await command(1)

  expect(autoSaveScheduleMock).toHaveBeenCalledWith(1, expect.any(Function))
})

test('scheduled auto save uses the latest modified editor state', async () => {
  const state = {
    initial: false,
    lines: ['original'],
    modified: false,
    redoStack: [],
    uid: 1,
    undoStack: [],
    uri: 'file:///one.txt',
  }
  EditorStates.set(1, state as any, state as any)
  const command = WrapCommands.wrapCommand((editor: any) => ({
    ...editor,
    lines: ['edited'],
    modified: true,
  }))

  await command(1)
  const saveAfterDelay = autoSaveScheduleMock.mock.calls[0][1]
  await saveAfterDelay(1)

  expect(getPreferenceMock).toHaveBeenCalledWith('files.autoSave')
  expect(saveMock).toHaveBeenCalledWith(expect.objectContaining({ lines: ['edited'], modified: true }))
  expect(EditorStates.get(1).newState).toMatchObject({ lines: ['edited'], modified: false })
  expect(rendererInvokeMock).toHaveBeenCalledWith('Editor.renderPending', 1)
})

test('scheduled auto save persists a document change even when modified is false', async () => {
  const state = {
    initial: false,
    lines: ['original'],
    modified: false,
    redoStack: [],
    uid: 1,
    undoStack: [],
    uri: 'file:///one.txt',
  }
  EditorStates.set(1, state as any, state as any)
  const command = WrapCommands.wrapCommand((editor: any) => ({
    ...editor,
    lines: ['edited'],
  }))

  await command(1)
  const saveAfterDelay = autoSaveScheduleMock.mock.calls[0][1]
  await saveAfterDelay(1)

  expect(saveMock).toHaveBeenCalledWith(expect.objectContaining({ lines: ['edited'], modified: false }))
  expect(rendererInvokeMock).toHaveBeenCalledWith('Editor.renderPending', 1)
})

test('cancels a pending auto save when the editor is saved explicitly', async () => {
  const state = {
    initial: false,
    lines: ['edited'],
    modified: true,
    redoStack: [],
    uid: 1,
    undoStack: [],
    uri: 'file:///one.txt',
  }
  EditorStates.set(1, state as any, state as any)
  const command = WrapCommands.wrapCommand((editor: any) => ({
    ...editor,
    modified: false,
  }))

  await command(1)

  expect(autoSaveDisposeMock).toHaveBeenCalledWith(1)
  expect(autoSaveScheduleMock).not.toHaveBeenCalled()
})

test('scheduled auto save does not save when the setting is off', async () => {
  const state = {
    initial: false,
    lines: ['original'],
    modified: false,
    redoStack: [],
    uid: 1,
    undoStack: [],
    uri: 'file:///one.txt',
  }
  EditorStates.set(1, state as any, state as any)
  const command = WrapCommands.wrapCommand((editor: any) => ({
    ...editor,
    lines: ['edited'],
    modified: true,
  }))
  getPreferenceMock.mockResolvedValue('off')

  await command(1)
  const saveAfterDelay = autoSaveScheduleMock.mock.calls[0][1]
  await saveAfterDelay(1)

  expect(saveMock).not.toHaveBeenCalled()
  expect(EditorStates.get(1).newState.modified).toBe(true)
  expect(rendererInvokeMock).not.toHaveBeenCalled()
})

test('does not schedule auto save when document text is unchanged', async () => {
  const state = {
    initial: false,
    lines: ['abc'],
    modified: true,
    redoStack: [],
    selection: 0,
    uid: 1,
    undoStack: [],
    uri: 'file:///one.txt',
  }
  EditorStates.set(1, state as any, state as any)
  const command = WrapCommands.wrapCommand((editor: any) => ({
    ...editor,
    selection: 1,
  }))

  await command(1)

  expect(autoSaveScheduleMock).not.toHaveBeenCalled()
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
