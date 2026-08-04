import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/UpdateDerivedState/UpdateDerivedState.ts', () => ({
  updateDerivedState: jest.fn(async (_oldEditor, newEditor) => newEditor),
}))

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
