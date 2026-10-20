import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import { WhenExpression, WidgetId } from '@lvce-editor/constants'

const updateDerivedStateMock = jest.fn()
const scheduleGutterMock = jest.fn()
const editorDiagnosticEffectApplyMock: any = jest.fn()
const editorDiagnosticEffectIsActiveMock: any = jest.fn()
const autoSaveScheduleMock = jest.fn<(uid: number, save: (token: number) => Promise<void>) => void>()
const autoSaveIsLatestMock = jest.fn<(uid: number, token: number) => boolean>()
const autoSaveConsumeMock = jest.fn<(uid: number, token: number) => void>()
const autoSaveDisposeMock = jest.fn<(uid: number) => void>()
const saveMock = jest.fn()
const getPreferenceMock = jest.fn<(key: string) => Promise<string>>()
const rendererInvokeMock = jest.fn()
const getFormattingEditsMock = jest.fn<() => Promise<readonly unknown[]>>()
const applyDocumentEditsMock = jest.fn()

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

jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandFormat.ts', () => ({
  getFormattingEdits: getFormattingEditsMock,
}))

jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandApplyDocumentEdits.ts', () => ({
  applyDocumentEdits: applyDocumentEditsMock,
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

jest.unstable_mockModule('../src/parts/ScheduleGutterDecorations/ScheduleGutterDecorations.ts', () => ({ schedule: scheduleGutterMock }))

const { handleFocus } = await import('../src/parts/EditorCommand/EditorCommandHandleFocus.ts')
const { handleBlur } = await import('../src/parts/EditorCommand/EditorCommandBlur.ts')
const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const WrapCommands = await import('../src/parts/WrapCommands/WrapCommands.ts')

beforeEach(() => {
  scheduleGutterMock.mockReset()
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
  getFormattingEditsMock.mockReset()
  getFormattingEditsMock.mockResolvedValue([])
  applyDocumentEditsMock.mockReset()
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

test('formats a saved snapshot without blocking edits and skips stale formatter results', async () => {
  const started = Promise.withResolvers<void>()
  const { promise, resolve } = Promise.withResolvers<readonly unknown[]>()
  getFormattingEditsMock.mockImplementation(async () => {
    started.resolve()
    return promise
  })
  const lifecycle = {}
  const state = {
    applicationId: 'source',
    initial: false,
    lifecycle,
    lines: ['before'],
    modified: false,
    redoStack: [],
    uid: 1,
    undoStack: [],
    uri: 'file:///sample.ts',
  }
  EditorStates.set(1, state as any, state as any)
  const save = WrapCommands.wrapCommand((editor: any) => ({ ...editor, postSaveFormat: true }))
  await save(1)
  await started.promise

  const edit = WrapCommands.wrapCommand((editor: any) => ({ ...editor, lines: ['newer edit'], modified: true }))
  await edit(1)
  resolve([{ endOffset: 6, inserted: 'formatted', startOffset: 0 }])
  await new Promise((resolveTask) => setTimeout(resolveTask, 0))

  expect(EditorStates.get(1).newState.lines).toEqual(['newer edit'])
  expect(EditorStates.get(1).newState.modified).toBe(true)
  expect(applyDocumentEditsMock).not.toHaveBeenCalled()
  expect(saveMock).not.toHaveBeenCalled()
})

test('persists changed post-save formatting and does not save when formatting is unchanged', async () => {
  const lifecycle = {}
  const state = {
    applicationId: 'source',
    initial: false,
    lifecycle,
    lines: ['before'],
    modified: false,
    redoStack: [],
    selections: new Uint32Array([0, 0, 0, 0]),
    uid: 1,
    undoStack: [],
    uri: 'file:///sample.ts',
  }
  EditorStates.set(1, state as any, state as any)
  getFormattingEditsMock.mockResolvedValue([{ endOffset: 6, inserted: 'after', startOffset: 0 }])
  applyDocumentEditsMock.mockImplementation((editor: any) => ({ ...editor, lines: ['after'], modified: true }))
  const save = WrapCommands.wrapCommand((editor: any) => ({ ...editor, postSaveFormat: true }))
  await save(1)
  await new Promise((resolveTask) => setTimeout(resolveTask, 0))
  expect(saveMock).toHaveBeenCalledTimes(1)
  expect((saveMock.mock.calls[0][0] as any).lines).toEqual(['after'])

  EditorStates.set(1, state as any, { ...state, postSaveFormat: true } as any)
  getFormattingEditsMock.mockResolvedValue([])
  saveMock.mockClear()
  await save(1)
  await new Promise((resolveTask) => setTimeout(resolveTask, 0))
  expect(saveMock).not.toHaveBeenCalled()
})

test('mouse moves skip superseded queued work and never commit an obsolete result', async () => {
  const started = Promise.withResolvers<void>()
  const active = Promise.withResolvers<void>()
  const seen: number[] = []
  const command = WrapCommands.wrapLatestCommand(async (state: any, offset: number) => {
    seen.push(offset)
    if (offset === 0) {
      started.resolve()
      await active.promise
    }
    return { ...state, text: String(offset) }
  })
  const first = command(1, 0)
  await started.promise
  const pending = Array.from({ length: 9 }, (_, index) => command(1, index + 1))
  active.resolve()
  await Promise.all([first, ...pending])
  expect(seen).toEqual([0, 9])
  expect(updateDerivedStateMock).toHaveBeenCalledTimes(1)
  expect((EditorStates.get(1).newState as any).text).toBe('9')
})

test('does not queue or synchronize identical uris across applications', async () => {
  const source = {
    applicationId: 'source',
    initial: false,
    lines: ['source'],
    modified: false,
    redoStack: [],
    uid: 1,
    undoStack: [],
    uri: 'memfs:///main.ts',
  }
  const preview = { ...source, applicationId: 'preview', lines: ['preview'], uid: 2 }
  EditorStates.set(1, source as any, source as any)
  EditorStates.set(2, preview as any, preview as any)
  const { promise, resolve } = Promise.withResolvers<void>()
  const command = WrapCommands.wrapCommand(async (editor: any) => {
    if (editor.applicationId === 'source') {
      await promise
    }
    return { ...editor, lines: [editor.applicationId + ' edited'], modified: true }
  })
  const sourceEdit = command(1)
  try {
    await command(2)
    expect(EditorStates.get(1).newState).toBe(source)
    expect(EditorStates.get(2).newState.lines).toEqual(['preview edited'])
  } finally {
    resolve()
    await sourceEdit
  }
  expect(EditorStates.get(1).newState.lines).toEqual(['source edited'])
  expect(EditorStates.get(2).newState.lines).toEqual(['preview edited'])
})

test('ignores a command for a disposed editor', async () => {
  EditorStates.dispose(1)
  const command = WrapCommands.wrapCommand((state: any) => state)

  await expect(command(1)).resolves.toBeUndefined()
})

test('ignores a queued command when the editor is disposed', async () => {
  const firstCommandStarted = Promise.withResolvers<void>()
  const finishFirstCommand = Promise.withResolvers<void>()
  const command = WrapCommands.wrapCommand(async (state: any) => {
    firstCommandStarted.resolve()
    await finishFirstCommand.promise
    return state
  })
  const queuedCommand = WrapCommands.wrapCommand((state: any) => state)

  const first = command(1)
  await firstCommandStarted.promise
  const second = queuedCommand(1)
  EditorStates.dispose(1)
  finishFirstCommand.resolve()

  await expect(first).resolves.toBeDefined()
  await expect(second).resolves.toBeUndefined()
})

test('requests diagnostics without blocking commands after the editor text changes', async () => {
  const oldState = {
    diagnosticsEnabled: true,
    lines: [''],
    uri: 'file:///one.txt',
  }
  const newState = {
    diagnosticsEnabled: true,
    lines: ['x'],
    uri: 'file:///one.txt',
  }
  const stateWithDiagnostics = {
    ...newState,
    diagnostics: [{ message: 'error' }],
  }
  EditorStates.set(1, oldState as any, oldState as any)
  editorDiagnosticEffectIsActiveMock.mockReturnValue(true)
  const diagnosticsResult = Promise.withResolvers<typeof stateWithDiagnostics>()
  editorDiagnosticEffectApplyMock.mockReturnValue(diagnosticsResult.promise)
  const command = WrapCommands.wrapCommand(() => newState)

  const result = await command(1)

  expect(editorDiagnosticEffectIsActiveMock).toHaveBeenCalledWith(oldState, newState)
  expect(editorDiagnosticEffectApplyMock).toHaveBeenCalledWith(newState)
  expect(result).toBe(newState)
  expect(EditorStates.get(1).newState).toBe(newState)
  diagnosticsResult.resolve(stateWithDiagnostics)
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

test('records cursor and selection changes', async () => {
  const selections = new Uint32Array([0, 0, 0, 0])
  const state = {
    initial: false,
    isSelecting: false,
    lines: ['abc'],
    modified: false,
    redoStack: [],
    selections,
    uid: 1,
    undoStack: [],
    uri: 'file:///one.txt',
  }
  EditorStates.set(1, state as any, state as any)
  const command = WrapCommands.wrapCommand((editor: any) => ({
    ...editor,
    selections: new Uint32Array([0, 1, 0, 1]),
  }))

  const result = await command(1)

  expect(result.cursorUndoStack).toEqual([selections])
  expect(result.cursorUndoStack[0]).not.toBe(selections)
})

test('groups pointer-drag selection changes', async () => {
  const previousSelections = new Uint32Array([0, 0, 0, 0])
  const state = {
    cursorUndoStack: [previousSelections],
    initial: false,
    isSelecting: true,
    lines: ['abc'],
    modified: false,
    redoStack: [],
    selections: new Uint32Array([0, 0, 0, 1]),
    uid: 1,
    undoStack: [],
    uri: 'file:///one.txt',
  }
  EditorStates.set(1, state as any, state as any)
  const command = WrapCommands.wrapCommand((editor: any) => ({
    ...editor,
    selections: new Uint32Array([0, 0, 0, 2]),
  }))

  const result = await command(1)

  expect(result.cursorUndoStack).toEqual([previousSelections])
})

test('records a pointer drag that starts at the current cursor', async () => {
  const selections = new Uint32Array([0, 0, 0, 0])
  const state = {
    initial: false,
    isSelecting: false,
    lines: ['abc'],
    modified: false,
    redoStack: [],
    selections,
    uid: 1,
    undoStack: [],
    uri: 'file:///one.txt',
  }
  EditorStates.set(1, state as any, state as any)
  const command = WrapCommands.wrapCommand((editor: any) => ({
    ...editor,
    isSelecting: true,
  }))

  const result = await command(1)

  expect(result.cursorUndoStack).toEqual([selections])
})

test('clears cursor history after a document edit', async () => {
  const state = {
    cursorUndoStack: [new Uint32Array([0, 0, 0, 0])],
    initial: false,
    isSelecting: false,
    lines: ['abc'],
    modified: false,
    redoStack: [],
    selections: new Uint32Array([0, 3, 0, 3]),
    uid: 1,
    undoStack: [],
    uri: 'file:///one.txt',
  }
  EditorStates.set(1, state as any, state as any)
  const command = WrapCommands.wrapCommand((editor: any) => ({
    ...editor,
    lines: ['abcd'],
    selections: new Uint32Array([0, 4, 0, 4]),
  }))

  const result = await command(1)

  expect(result.cursorUndoStack).toEqual([])
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

test('does not schedule auto save for an untitled file', async () => {
  const state = {
    initial: false,
    lines: [''],
    modified: false,
    redoStack: [],
    uid: 1,
    undoStack: [],
    uri: 'untitled:///1',
  }
  EditorStates.set(1, state as any, state as any)
  const command = WrapCommands.wrapCommand((editor: any) => ({
    ...editor,
    lines: ['edited'],
    modified: true,
  }))

  await command(1)

  expect(autoSaveScheduleMock).not.toHaveBeenCalled()
  expect(saveMock).not.toHaveBeenCalled()
  expect(EditorStates.get(1).newState).toMatchObject({ lines: ['edited'], modified: true })
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

test('ignores editor focus events queued while a rename widget is opening', async () => {
  const editor = {
    focus: WhenExpression.FocusEditorText,
    focused: true,
    modified: false,
    selections: new Uint32Array([0, 0, 0, 0]),
    uid: 1,
    widgetRevision: 0,
    widgets: [],
  }
  EditorStates.set(1, editor as any, editor as any)
  const started = Promise.withResolvers<void>()
  const finish = Promise.withResolvers<void>()
  const renameWidget = { id: WidgetId.Rename }
  const openRename = WrapCommands.wrapCommand(async (state: any) => {
    started.resolve()
    await finish.promise
    return {
      ...state,
      focus: WhenExpression.FocusEditorRename,
      focused: false,
      widgetRevision: 1,
      widgets: [renameWidget],
    }
  })
  const opening = openRename(1)
  await started.promise
  const focusing = WrapCommands.wrapFocusCommand(handleFocus)(1)
  const blurring = WrapCommands.wrapCommand(handleBlur)(1)
  finish.resolve()
  await Promise.all([opening, focusing, blurring])

  expect(EditorStates.get(1).newState).toMatchObject({
    focus: WhenExpression.FocusEditorRename,
    focused: false,
    widgets: [renameWidget],
  })
})

test('applies a new editor focus event after a widget has opened', async () => {
  const editor = {
    focus: WhenExpression.FocusEditorRename,
    focused: false,
    selections: new Uint32Array([0, 0, 0, 0]),
    widgetRevision: 1,
  }
  EditorStates.set(1, editor as any, editor as any)

  await WrapCommands.wrapFocusCommand(handleFocus)(1)

  expect(EditorStates.get(1).newState).toMatchObject({
    focus: WhenExpression.FocusEditorText,
    focused: true,
  })
})

test('keeps a new editor focus event queued after a blur', async () => {
  const editor = {
    focus: WhenExpression.FocusEditorText,
    focused: true,
    modified: false,
    selections: new Uint32Array([0, 0, 0, 0]),
    uid: 1,
    widgetRevision: 0,
    widgets: [],
  }
  EditorStates.set(1, editor as any, editor as any)

  const blurring = WrapCommands.wrapCommand(handleBlur)(1)
  const focusing = WrapCommands.wrapFocusCommand(handleFocus)(1)
  await Promise.all([blurring, focusing])

  expect(EditorStates.get(1).newState.focused).toBe(true)
})

test('deferred provider work does not block editing and cannot overwrite an intervening edit', async () => {
  const started = Promise.withResolvers<void>()
  const provider = Promise.withResolvers<void>()
  const hover = WrapCommands.wrapDeferredCommand(async (state: any) => {
    started.resolve()
    await provider.promise
    return { ...state, text: 'stale hover state' }
  })
  const pendingHover = hover(1)
  await started.promise
  let timeout: ReturnType<typeof setTimeout> | undefined
  try {
    const edit = WrapCommands.wrapCommand((state: any) => ({ ...state, text: 'typed' }))
    await Promise.race([
      edit(1),
      new Promise<never>((_resolve, reject) => {
        timeout = setTimeout(() => reject(new Error('Hover blocked editing')), 1000)
      }),
    ])
    expect((EditorStates.get(1).newState as any).text).toBe('typed')
  } finally {
    clearTimeout(timeout)
    provider.resolve()
    await pendingHover
  }
  expect((EditorStates.get(1).newState as any).text).toBe('typed')
})

test('applies deferred results when the editor snapshot is still current', async () => {
  const command = WrapCommands.wrapDeferredCommand(async (state: any) => ({ ...state, text: 'hover' }))
  await command(1)
  expect((EditorStates.get(1).newState as any).text).toBe('hover')
})

test('captures deferred state after earlier edits have committed', async () => {
  const command = WrapCommands.wrapCommand((state: any) => ({ ...state, text: 'edit' }))
  const seen: string[] = []
  const hover = WrapCommands.wrapDeferredCommand(async (state: any) => {
    seen.push(state.text)
    return state
  })
  await Promise.all([command(1), hover(1)])
  expect(seen).toEqual(['edit'])
})

test('deferred failures reject their caller without blocking later commands', async () => {
  const command = WrapCommands.wrapDeferredCommand(async () => {
    throw new Error('provider failed')
  })
  await expect(command(1)).rejects.toThrow('provider failed')
  await WrapCommands.wrapCommand((state: any) => ({ ...state, text: 'still responsive' }))(1)
  expect((EditorStates.get(1).newState as any).text).toBe('still responsive')
})

test.each([false, true])('does not apply deferred results after disposal (recreate: %s)', async (recreate) => {
  const started = Promise.withResolvers<void>()
  const provider = Promise.withResolvers<void>()
  const command = WrapCommands.wrapDeferredCommand(async (state: any) => {
    started.resolve()
    await provider.promise
    return { ...state, text: 'stale' }
  })
  const pending = command(1)
  await started.promise
  EditorStates.dispose(1)
  if (recreate) {
    const state = { text: 'recreated' } as any
    EditorStates.set(1, state, state)
  }
  provider.resolve()
  await pending
  expect((EditorStates.get(1)?.newState as any)?.text).toBe(recreate ? 'recreated' : undefined)
})

test('does not invoke a deferred provider for an absent editor', async () => {
  const provider = jest.fn<(state: any) => Promise<any>>()
  EditorStates.dispose(1)
  await WrapCommands.wrapDeferredCommand(provider)(1)
  expect(provider).not.toHaveBeenCalled()
})

test('keeps pending text changes when focus commits before rendering', async () => {
  const rendered = { focused: false, initial: false, lines: ['original'], selections: new Uint32Array(4), uid: 1, uri: 'memfs:///cursor.js' }
  EditorStates.set(1, rendered as any, rendered as any)
  const type = WrapCommands.wrapCommand((editor: any) => ({ ...editor, lines: ['edited'] }))
  const focus = WrapCommands.wrapFocusCommand(handleFocus)

  await type(1)
  await focus(1)

  expect(EditorStates.get(1).oldState).toBe(rendered)
  expect(EditorStates.get(1).newState.lines).toEqual(['edited'])
  expect(EditorStates.get(1).newState.focused).toBe(true)
})

test('uses the latest rendered baseline when a command awaits derived state', async () => {
  const rendered = { initial: false, lines: ['original'], uid: 1, uri: 'memfs:///cursor.js' }
  const pending = { ...rendered, lines: ['pending'] }
  EditorStates.set(1, rendered as any, pending as any)
  const started = Promise.withResolvers<void>()
  const finish = Promise.withResolvers<void>()
  updateDerivedStateMock.mockImplementation(async (_oldState, newState) => {
    started.resolve()
    await finish.promise
    return newState
  })
  const type = WrapCommands.wrapCommand((editor: any) => ({ ...editor, lines: ['edited'] }))
  const typing = type(1)
  await started.promise
  // render2 acknowledges the previous pending edit while this command is suspended.
  EditorStates.set(1, pending as any, pending as any)
  finish.resolve()
  await typing

  expect(EditorStates.get(1).oldState).toBe(pending)
  expect(EditorStates.get(1).newState.lines).toEqual(['edited'])
})

test('defers gutter providers for an edit but retains synchronous refresh on initial load', async () => {
  const editor: any = { focused: false, initial: false, lifecycle: { disposed: false }, lines: ['a'], uid: 1, uri: 'untitled:///1' }
  EditorStates.set(1, editor, editor)
  const command = WrapCommands.wrapCommand((state: any) => ({ ...state, lines: ['ab'] }))
  const result = await command(1)
  expect(updateDerivedStateMock).toHaveBeenCalledWith(editor, expect.objectContaining({ lines: ['ab'] }), true)
  expect(scheduleGutterMock).toHaveBeenCalledWith(result)
  scheduleGutterMock.mockClear()
  updateDerivedStateMock.mockClear()
  const initial = { ...editor, initial: true }
  EditorStates.set(1, initial, initial)
  await command(1)
  expect(updateDerivedStateMock).toHaveBeenCalledWith(initial, expect.objectContaining({ lines: ['ab'] }), false)
  expect(scheduleGutterMock).not.toHaveBeenCalled()
})

test('applies deferred widgets across diagnostic commits while preserving the latest diagnostics', async () => {
  const started = Promise.withResolvers<void>()
  const ready = Promise.withResolvers<void>()
  const initial = { decorations: [], diagnostics: [], lightBulbRowIndex: -1, text: 'unchanged', visualDecorations: [], widgets: [] }
  EditorStates.set(1, initial as any, initial as any)
  const widgets = [{ id: WidgetId.Completion }]
  const completion = WrapCommands.wrapDeferredCommand(async (editor: any) => {
    started.resolve()
    await ready.promise
    return { ...editor, widgets }
  })
  const pending = completion(1)
  await started.promise
  const current = {
    ...initial,
    decorations: [1, 2, 3, 4],
    diagnostics: [{ message: 'fresh diagnostic' }],
    lightBulbRowIndex: 2,
    visualDecorations: [{ offset: 1 }],
  }
  EditorStates.set(1, initial as any, current as any)
  ready.resolve()
  await pending
  expect(EditorStates.get(1).newState).toMatchObject({ ...current, widgets })
})

test('rejects a deferred widget if the editor lifecycle changes alongside diagnostics', async () => {
  const started = Promise.withResolvers<void>()
  const ready = Promise.withResolvers<void>()
  const initial = { diagnostics: [], lifecycle: {}, widgets: [] }
  EditorStates.set(1, initial as any, initial as any)
  const completion = WrapCommands.wrapDeferredCommand(async (editor: any) => {
    started.resolve()
    await ready.promise
    return { ...editor, widgets: [{ id: WidgetId.Completion }] }
  })
  const pending = completion(1)
  await started.promise
  EditorStates.dispose(1)
  const recreated = { ...initial, diagnostics: [{ message: 'new instance' }], lifecycle: {} }
  EditorStates.set(1, recreated as any, recreated as any)
  ready.resolve()
  await pending
  expect(EditorStates.get(1).newState).toBe(recreated)
})

test('does not restore an editor disposed while its command is awaiting work', async () => {
  const command = WrapCommands.wrapCommand(async (state: any) => {
    await Promise.resolve()
    EditorStates.dispose(1)
    return { ...state, text: 'stale' }
  })
  await command(1)
  expect(EditorStates.get(1)).toBeUndefined()
})

test('does not restore an editor disposed while derived state is pending', async () => {
  updateDerivedStateMock.mockImplementationOnce(async (_oldState, newState) => {
    await Promise.resolve()
    EditorStates.dispose(1)
    return newState
  })
  const command = WrapCommands.wrapCommand((state: any) => ({ ...state, text: 'stale' }))
  await command(1)
  expect(EditorStates.get(1)).toBeUndefined()
})

test.each([false, true])('does not overwrite a replacement editor after pending work (derived: %s)', async (derived) => {
  const original: any = { lifecycle: { disposed: false }, text: 'original' }
  const replacement: any = { lifecycle: { disposed: false }, text: 'replacement' }
  EditorStates.set(1, original, original)
  const replaceEditor = async (state: any): Promise<any> => {
    await Promise.resolve()
    original.lifecycle.disposed = true
    EditorStates.dispose(1)
    EditorStates.set(1, replacement, replacement)
    return { ...state, text: 'stale' }
  }
  if (derived) {
    updateDerivedStateMock.mockImplementationOnce(async (_oldState, state) => replaceEditor(state))
  }
  const command = WrapCommands.wrapCommand(derived ? (state: any) => ({ ...state, text: 'pending' }) : replaceEditor)
  await command(1)
  expect(EditorStates.get(1).newState).toBe(replacement)
})

test('does not restore a split editor disposed while its synchronized derived state is pending', async () => {
  const first: any = { lifecycle: { disposed: false }, lines: ['original'], uri: 'untitled:///shared' }
  const second: any = { lifecycle: { disposed: false }, lines: first.lines, uri: first.uri }
  EditorStates.set(1, first, first)
  EditorStates.set(2, second, second)
  updateDerivedStateMock.mockImplementation(async (oldState, newState) => {
    await Promise.resolve()
    if (oldState === second) {
      second.lifecycle.disposed = true
      EditorStates.dispose(2)
    }
    return newState
  })
  await WrapCommands.wrapCommand((state: any) => ({ ...state, lines: ['edited'] }))(1)
  expect(EditorStates.get(1).newState.lines).toEqual(['edited'])
  expect(EditorStates.get(2)).toBeUndefined()
})

test('latest mouse commands leave other editors and ordinary edits independent', async () => {
  const state = { text: '' }
  EditorStates.set(2, state as any, state as any)
  const started = Promise.withResolvers<void>()
  const active = Promise.withResolvers<void>()
  const command = WrapCommands.wrapLatestCommand(async (editor: any, text: string) => {
    if (text === 'old') {
      started.resolve()
      await active.promise
    }
    return { ...editor, text: editor.text + text }
  })
  const first = command(1, 'old')
  await started.promise
  await command(2, 'other')
  const edit = WrapCommands.wrapCommand((editor: any) => ({ ...editor, text: editor.text + 'edit' }))(1)
  const latest = command(1, 'latest')
  active.resolve()
  await Promise.all([first, edit, latest])
  expect((EditorStates.get(1).newState as any).text).toBe('editlatest')
  expect((EditorStates.get(2).newState as any).text).toBe('other')
})
