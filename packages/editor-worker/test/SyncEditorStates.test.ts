import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

const updateDerivedStateMock: any = jest.fn()

jest.unstable_mockModule('../src/parts/UpdateDerivedState/UpdateDerivedState.ts', () => ({
  updateDerivedState: updateDerivedStateMock,
}))

const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const SyncEditorStates = await import('../src/parts/SyncEditorStates/SyncEditorStates.ts')

const edit = {
  deleted: [''],
  end: {
    columnIndex: 1,
    rowIndex: 0,
  },
  inserted: ['x'],
  origin: 'editor.type',
  start: {
    columnIndex: 1,
    rowIndex: 0,
  },
}

const createEditor = (uid: number, uri: string, overrides: Record<string, unknown> = {}) =>
  ({
    decorations: [],
    deltaY: 0,
    diagnostics: [],
    focused: false,
    id: uid,
    incrementalEdits: [],
    initial: false,
    invalidStartIndex: 0,
    lines: ['ab'],
    modified: false,
    redoStack: [],
    selections: new Uint32Array([0, 2, 0, 2]),
    uid,
    undoStack: [],
    uri,
    visualDecorations: [],
    ...overrides,
  }) as any

beforeEach(() => {
  updateDerivedStateMock.mockReset()
  updateDerivedStateMock.mockImplementation(async (_oldState: any, newState: any) => ({
    ...newState,
    derived: true,
  }))
})

afterEach(() => {
  EditorStates.dispose(1)
  EditorStates.dispose(2)
  EditorStates.dispose(3)
})

test('synchronizes document state while preserving sibling view state', async () => {
  const oldSource = createEditor(1, 'file:///same.txt')
  const newSource = createEditor(1, 'file:///same.txt', {
    decorations: ['link'],
    diagnostics: ['diagnostic'],
    lines: ['axb'],
    modified: true,
    undoStack: [[edit]],
    visualDecorations: ['squiggle'],
  })
  const sibling = createEditor(2, 'file:///same.txt', {
    deltaY: 40,
    focused: true,
  })
  EditorStates.set(1, oldSource, newSource)
  EditorStates.set(2, sibling, sibling)

  await SyncEditorStates.syncEditorStates(1, oldSource, newSource)

  const result: any = EditorStates.get(2).newState
  expect(result).toMatchObject({
    decorations: ['link'],
    deltaY: 40,
    derived: true,
    diagnostics: ['diagnostic'],
    focused: true,
    lines: ['axb'],
    modified: true,
    visualDecorations: ['squiggle'],
  })
  expect(result.selections).toEqual(new Uint32Array([0, 3, 0, 3]))
  expect(result.undoStack).toBe(newSource.undoStack)
})

test('synchronizes changes initiated by the second editor', async () => {
  const sibling = createEditor(1, 'file:///same.txt')
  const oldSource = createEditor(2, 'file:///same.txt')
  const newSource = createEditor(2, 'file:///same.txt', {
    lines: ['axb'],
    modified: true,
    undoStack: [[edit]],
  })
  EditorStates.set(1, sibling, sibling)
  EditorStates.set(2, oldSource, newSource)

  await SyncEditorStates.syncEditorStates(2, oldSource, newSource)

  expect(EditorStates.get(1).newState.lines).toEqual(['axb'])
})

test('does not synchronize editors for another uri', async () => {
  const oldSource = createEditor(1, 'file:///one.txt')
  const newSource = createEditor(1, 'file:///one.txt', {
    lines: ['axb'],
    modified: true,
    undoStack: [[edit]],
  })
  const other = createEditor(2, 'file:///two.txt')
  EditorStates.set(1, oldSource, newSource)
  EditorStates.set(2, other, other)

  await SyncEditorStates.syncEditorStates(1, oldSource, newSource)

  expect(EditorStates.get(2).newState).toBe(other)
  expect(updateDerivedStateMock).not.toHaveBeenCalled()
})

test('does not overwrite an editor that is still loading', async () => {
  const oldSource = createEditor(1, 'file:///same.txt')
  const newSource = createEditor(1, 'file:///same.txt', {
    lines: ['axb'],
    modified: true,
    undoStack: [[edit]],
  })
  const loading = createEditor(2, 'file:///same.txt', { initial: true })
  EditorStates.set(1, oldSource, newSource)
  EditorStates.set(2, loading, loading)

  await SyncEditorStates.syncEditorStates(1, oldSource, newSource)

  expect(EditorStates.get(2).newState).toBe(loading)
})

test('synchronizes dirty state after saving without changing text', async () => {
  const oldSource = createEditor(1, 'file:///same.txt', { modified: true })
  const newSource = createEditor(1, 'file:///same.txt', { modified: false })
  const sibling = createEditor(2, 'file:///same.txt', { modified: true })
  EditorStates.set(1, oldSource, newSource)
  EditorStates.set(2, sibling, sibling)

  await SyncEditorStates.syncEditorStates(1, oldSource, newSource)

  expect(EditorStates.get(2).newState.modified).toBe(false)
})

test('transforms the sibling selection for an undo', async () => {
  const oldSource = createEditor(1, 'file:///same.txt', {
    lines: ['axb'],
    modified: true,
    undoStack: [[edit]],
  })
  const newSource = createEditor(1, 'file:///same.txt', {
    lines: ['ab'],
    modified: true,
    redoStack: [[edit]],
    undoStack: [],
  })
  const sibling = createEditor(2, 'file:///same.txt', {
    lines: ['axb'],
    selections: new Uint32Array([0, 3, 0, 3]),
  })
  EditorStates.set(1, oldSource, newSource)
  EditorStates.set(2, sibling, sibling)

  await SyncEditorStates.syncEditorStates(1, oldSource, newSource)

  expect(EditorStates.get(2).newState.selections).toEqual(new Uint32Array([0, 2, 0, 2]))
})
