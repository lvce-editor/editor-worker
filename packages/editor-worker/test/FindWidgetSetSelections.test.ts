import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/UpdateDerivedState/UpdateDerivedState.ts', () => ({
  updateDerivedState: jest.fn(async (_oldEditor, newEditor) => newEditor),
}))

const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const { getFindWidgetWorkerCommandMap } = await import('../src/parts/GetFindWidgetWorkerCommandMap/GetFindWidgetWorkerCommandMap.ts')

test.each([
  [0, 5, 80],
  [100, 0, 0],
  [0, 19, 300],
  [40, 3, 40],
])('find selection scrolls from %i to centered row %i', async (deltaY, row, expectedDeltaY) => {
  const editorUid = 1
  const editor = {
    deltaY,
    finalDeltaY: 300,
    height: 60,
    itemHeight: 20,
    lineCache: [],
    lines: Array.from({ length: 20 }, (_, index) => `line ${index + 1}`),
    maxLineY: deltaY / 20 + 3,
    minLineY: deltaY / 20,
    numberOfVisibleLines: 3,
    scrollBarHeight: 10,
    selections: new Uint32Array([0, 0, 0, 0]),
    uid: editorUid,
  }
  EditorStates.set(editorUid, editor as any, editor as any)

  await getFindWidgetWorkerCommandMap()['Editor.setSelections2'](editorUid, new Uint32Array([row, 0, row, 4]))

  expect(EditorStates.get(editorUid)?.newState).toMatchObject({
    deltaY: expectedDeltaY,
    selections: new Uint32Array([row, 0, row, 4]),
  })
})
