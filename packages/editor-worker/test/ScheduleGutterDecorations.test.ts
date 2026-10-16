import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

const getDecorations = jest.fn<(editor: any) => Promise<any[]>>()
const derive = jest.fn<(previous: any, next: any) => Promise<any>>()
const render = jest.fn<(...args: any[]) => Promise<void>>()

jest.unstable_mockModule('../src/parts/GetEditorGutterDecorations/GetEditorGutterDecorations.ts', () => ({
  getEditorGutterDecorations: getDecorations,
}))
jest.unstable_mockModule('../src/parts/UpdateDerivedState/UpdateDerivedState.ts', () => ({ updateDerivedState: derive }))
jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({ RendererWorker: { invoke: render } }))

const Editors = await import('../src/parts/EditorStates/EditorStates.ts')
const Queue = await import('../src/parts/EditorCommandQueue/EditorCommandQueue.ts')
const Refresh = await import('../src/parts/ScheduleGutterDecorations/ScheduleGutterDecorations.ts')

const createEditor = (): any => ({
  applicationId: 'app',
  gutterDecorations: [],
  languageId: 'plaintext',
  lifecycle: { disposed: false },
  lines: ['a'],
  uid: 1,
  uri: 'file:///test.txt',
})
const flush = async () => {
  for (let i = 0; i < 40; i++) await Promise.resolve()
}

beforeEach(() => {
  getDecorations.mockReset().mockResolvedValue([{ rowIndex: 0, type: 'modified' }])
  derive.mockReset().mockImplementation(async (_previous, next) => next)
  render.mockReset().mockResolvedValue(undefined)
})
afterEach(() => Editors.dispose(1))

test('slow gutter providers do not hold the editor queue; completed decorations rerender', async () => {
  const editor = createEditor()
  Editors.set(1, editor, editor)
  const pending = Promise.withResolvers<any[]>()
  getDecorations.mockReturnValueOnce(pending.promise)
  Refresh.schedule(editor)
  expect(await Queue.enqueue(1, async () => 'editable')).toBe('editable')
  expect(render).not.toHaveBeenCalled()
  pending.resolve([{ rowIndex: 0, type: 'added' }])
  await flush()
  expect(Editors.get(1).newState.gutterDecorations).toEqual([{ rowIndex: 0, type: 'added' }])
  expect(render).toHaveBeenCalledWith('Editor.renderPending', 1)
})

test('coalesces rapid edits and drops a response for older lines', async () => {
  const editor = createEditor()
  Editors.set(1, editor, editor)
  const pending = Promise.withResolvers<any[]>()
  getDecorations.mockReturnValueOnce(pending.promise)
  Refresh.schedule(editor)
  const second = { ...editor, lines: ['ab'] }
  const latest = { ...editor, lines: ['abc'] }
  Refresh.schedule(second)
  Refresh.schedule(latest)
  Editors.set(1, editor, latest)
  pending.resolve([{ rowIndex: 0, type: 'deleted' }])
  await flush()
  expect(getDecorations.mock.calls.map(([state]) => state.lines)).toEqual([['a'], ['abc']])
  expect(derive).toHaveBeenCalledTimes(1)
  expect(Editors.get(1).newState.lines).toBe(latest.lines)
  expect(Editors.get(1).newState.gutterDecorations).toEqual([{ rowIndex: 0, type: 'modified' }])
})

test.each(['uri', 'languageId', 'applicationId', 'lifecycle', 'gutterDecorations'])('rejects a response after %s changes', async (key) => {
  const editor = createEditor()
  Editors.set(1, editor, editor)
  const pending = Promise.withResolvers<any[]>()
  getDecorations.mockReturnValueOnce(pending.promise)
  Refresh.schedule(editor)
  const current = {
    ...editor,
    [key]: key === 'lifecycle' ? { disposed: false } : key === 'gutterDecorations' ? [{ rowIndex: 1, type: 'added' }] : 'changed',
  }
  Editors.set(1, editor, current)
  pending.resolve([])
  await flush()
  expect(derive).not.toHaveBeenCalled()
  expect(render).not.toHaveBeenCalled()
})

test('disposed editors and reused UIDs never receive an old response', async () => {
  const editor = createEditor()
  Editors.set(1, editor, editor)
  const pending = Promise.withResolvers<any[]>()
  getDecorations.mockReturnValueOnce(pending.promise)
  Refresh.schedule(editor)
  editor.lifecycle.disposed = true
  const replacement = createEditor()
  Editors.set(1, replacement, replacement)
  pending.resolve([])
  await flush()
  expect(Editors.get(1).newState).toBe(replacement)
  expect(render).not.toHaveBeenCalled()
  Refresh.schedule(editor)
  Refresh.schedule({ ...editor, lifecycle: undefined })
  expect(getDecorations).toHaveBeenCalledTimes(1)
})

test('keeps the latest rendered baseline while deriving gutter layout', async () => {
  const editor = createEditor()
  Editors.set(1, editor, editor)
  const pending = Promise.withResolvers<any>()
  derive.mockReturnValueOnce(pending.promise)
  Refresh.schedule(editor)
  await flush()
  const rendered = { ...editor, rendered: true }
  Editors.set(1, rendered, editor)
  pending.resolve({ ...editor, gutterDecorations: [{ rowIndex: 0, type: 'modified' }] })
  await flush()
  expect(Editors.get(1).oldState).toBe(rendered)
})

test('checks disposal again after asynchronous layout derivation', async () => {
  const editor = createEditor()
  Editors.set(1, editor, editor)
  const pending = Promise.withResolvers<any>()
  derive.mockReturnValueOnce(pending.promise)
  Refresh.schedule(editor)
  await flush()
  editor.lifecycle.disposed = true
  pending.resolve(editor)
  await flush()
  expect(render).not.toHaveBeenCalled()
})

test('unchanged decoration results do not schedule an extra frame', async () => {
  const editor = createEditor()
  Editors.set(1, editor, editor)
  getDecorations.mockResolvedValue([])
  Refresh.schedule(editor)
  await flush()
  expect(derive).not.toHaveBeenCalled()
  expect(render).not.toHaveBeenCalled()
})
