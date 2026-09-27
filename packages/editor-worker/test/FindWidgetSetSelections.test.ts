import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/UpdateDerivedState/UpdateDerivedState.ts', () => ({
  updateDerivedState: jest.fn(async (_oldEditor, newEditor) => newEditor),
}))

const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const { getFindWidgetWorkerCommandMap } = await import('../src/parts/GetFindWidgetWorkerCommandMap/GetFindWidgetWorkerCommandMap.ts')

test.each([
  [0, 2, 40],
  [40, 0, 0],
  [20, 1, 20],
])('find selection scrolls from %i to row %i', async (deltaY, row, expectedDeltaY) => {
  const editorUid = 1
  const editor = {
    deltaY,
    finalDeltaY: 40,
    height: 20,
    itemHeight: 20,
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    maxLineY: deltaY / 20 + 1,
    minLineY: deltaY / 20,
    numberOfVisibleLines: 1,
    scrollBarHeight: 10,
    selections: new Uint32Array([0, 0, 0, 0]),
    uid: editorUid,
  }
  EditorStates.set(editorUid, editor as any, editor as any)

  await getFindWidgetWorkerCommandMap()['Editor.setSelections2'](editorUid, new Uint32Array([row, 0, row, 4]))

  expect(EditorStates.get(editorUid)?.newState).toMatchObject({
    deltaY: expectedDeltaY,
    maxLineY: row + 1,
    minLineY: row,
    selections: new Uint32Array([row, 0, row, 4]),
  })
})
