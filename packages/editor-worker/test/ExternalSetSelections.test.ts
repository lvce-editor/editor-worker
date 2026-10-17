import { expect, jest, test } from '@jest/globals'

const updateDerivedState = jest.fn<any>(async (_oldEditor: any, newEditor: any) => newEditor)
jest.unstable_mockModule('../src/parts/UpdateDerivedState/UpdateDerivedState.ts', () => ({ updateDerivedState }))

const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const ExternalGetPositionAtCursor = await import('../src/parts/ExternalGetPositionAtCursor/ExternalGetPositionAtCursor.ts')

test('setSelections2 reveals the supplied selection', async () => {
  const editorUid = 1
  const editor = {
    deltaY: 0,
    finalDeltaY: 40,
    height: 20,
    itemHeight: 20,
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    maxLineY: 1,
    minLineY: 0,
    numberOfVisibleLines: 1,
    scrollBarHeight: 10,
    selections: new Uint32Array([0, 0, 0, 0]),
    uid: editorUid,
  }
  EditorStates.set(editorUid, editor as any, editor as any)

  await ExternalGetPositionAtCursor.setSelections2(editorUid, new Uint32Array([2, 0, 2, 0]))

  expect(EditorStates.get(editorUid)?.newState).toMatchObject({
    deltaY: 40,
    maxLineY: 3,
    minLineY: 2,
    selections: new Uint32Array([2, 0, 2, 0]),
  })
})

const createEditor = (uid: number) => ({
  deltaY: 0,
  finalDeltaY: 0,
  height: 100,
  itemHeight: 20,
  lifecycle: {},
  lineCache: [],
  lines: ['one', 'two'],
  maxLineY: 2,
  minLineY: 0,
  numberOfVisibleLines: 5,
  scrollBarHeight: 10,
  selections: new Uint32Array([0, 0, 0, 0]),
  uid,
  uri: `memfs:///selection-${uid}`,
})

test('selection restore keeps content changes pending until render', async () => {
  const editor = createEditor(21)
  const rendered = { ...editor, initial: true, lines: [] }
  EditorStates.set(21, rendered as any, editor as any)
  await ExternalGetPositionAtCursor.setSelections2(21, new Uint32Array([1, 0, 1, 2]))
  expect(EditorStates.get(21).oldState).toBe(rendered)
  expect(EditorStates.get(21).newState.lines).toEqual(['one', 'two'])
})

test('selection restore uses a render completed while derived state was pending', async () => {
  const editor = createEditor(22)
  EditorStates.set(22, { ...editor, lines: [] } as any, editor as any)
  const { promise, resolve } = Promise.withResolvers<void>()
  const { promise: started, resolve: start } = Promise.withResolvers<void>()
  updateDerivedState.mockImplementationOnce(async (_old: any, next: any) => {
    start()
    await promise
    return next
  })
  const pending = ExternalGetPositionAtCursor.setSelections2(22, new Uint32Array([1, 0, 1, 2]))
  await started
  const rendered = { ...editor }
  EditorStates.set(22, rendered as any, editor as any)
  resolve()
  await pending
  expect(EditorStates.get(22).oldState).toBe(rendered)
})

test('selection restore does not overwrite a replacement editor after an await', async () => {
  const editor = createEditor(23)
  EditorStates.set(23, editor as any, editor as any)
  const { promise, resolve } = Promise.withResolvers<void>()
  const { promise: started, resolve: start } = Promise.withResolvers<void>()
  updateDerivedState.mockImplementationOnce(async (_old: any, next: any) => {
    start()
    await promise
    return next
  })
  const pending = ExternalGetPositionAtCursor.setSelections2(23, new Uint32Array([1, 0, 1, 2]))
  await started
  const replacement = { ...editor, lifecycle: {}, lines: ['replacement'] }
  EditorStates.set(23, replacement as any, replacement as any)
  resolve()
  await pending
  expect(EditorStates.get(23).newState).toBe(replacement)
})

test('concurrent selection restores commit in command order', async () => {
  const editor = createEditor(24)
  EditorStates.set(24, editor as any, editor as any)
  const { promise, resolve } = Promise.withResolvers<void>()
  const { promise: started, resolve: start } = Promise.withResolvers<void>()
  updateDerivedState.mockImplementationOnce(async (_old: any, next: any) => {
    start()
    await promise
    return next
  })
  const first = ExternalGetPositionAtCursor.setSelections2(24, new Uint32Array([0, 0, 0, 1]))
  await started
  const second = ExternalGetPositionAtCursor.setSelections2(24, new Uint32Array([1, 0, 1, 2]))
  resolve()
  await Promise.all([first, second])
  expect(EditorStates.get(24).newState.selections).toEqual(new Uint32Array([1, 0, 1, 2]))
})

test('a selection restore queued before replacement cannot affect the new editor', async () => {
  const editor = createEditor(25)
  EditorStates.set(25, editor as any, editor as any)
  const { promise, resolve } = Promise.withResolvers<void>()
  const { promise: started, resolve: start } = Promise.withResolvers<void>()
  updateDerivedState.mockImplementationOnce(async (_old: any, next: any) => {
    start()
    await promise
    return next
  })
  const first = ExternalGetPositionAtCursor.setSelections2(25, new Uint32Array([0, 0, 0, 1]))
  await started
  const second = ExternalGetPositionAtCursor.setSelections2(25, new Uint32Array([1, 0, 1, 2]))
  const replacement = { ...editor, lifecycle: {}, lines: ['replacement'] }
  EditorStates.set(25, replacement as any, replacement as any)
  resolve()
  await Promise.all([first, second])
  expect(EditorStates.get(25).newState).toBe(replacement)
})

test('selection restore leaves a disposed editor and another application untouched', async () => {
  const editor = { ...createEditor(26), lifecycle: { disposed: true } }
  const other = { ...createEditor(27), applicationId: 2, uri: editor.uri }
  EditorStates.set(26, editor as any, editor as any)
  EditorStates.set(27, other as any, other as any)
  await ExternalGetPositionAtCursor.setSelections2(26, new Uint32Array([1, 0, 1, 2]))
  expect(EditorStates.get(26).newState).toBe(editor)
  expect(EditorStates.get(27).newState).toBe(other)
})
