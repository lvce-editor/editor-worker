import { expect, jest, test } from '@jest/globals'
import { WidgetId } from '@lvce-editor/constants'

const dispose = jest.fn(async (_command: string) => {})
const setFocus = jest.fn(async (_focusKey: number) => {})
const unsetAdditionalFocus = jest.fn(async (_focusKey: number) => {})

jest.unstable_mockModule('../src/parts/GetWidgetInvoke/GetWidgetInvoke.ts', () => ({
  getWidgetInvoke: jest.fn(() => dispose),
}))

jest.unstable_mockModule('../src/parts/SetFocus/SetFocus.ts', () => ({
  setFocus,
  unsetAdditionalFocus,
}))

jest.unstable_mockModule('../src/parts/UpdateDerivedState/UpdateDerivedState.ts', () => ({
  updateDerivedState: jest.fn(async (_oldEditor, newEditor) => newEditor),
}))

const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const ExternalGetPositionAtCursor = await import('../src/parts/ExternalGetPositionAtCursor/ExternalGetPositionAtCursor.ts')

test('closeWidget2 clears the stored additional focus', async () => {
  const editorUid = 1
  const editor = {
    additionalFocus: 9,
    decorations: [],
    focused: true,
    uid: editorUid,
    widgets: [{ id: WidgetId.Completion }],
  }
  EditorStates.set(editorUid, editor as any, editor as any)

  await ExternalGetPositionAtCursor.closeWidget2(editorUid, WidgetId.Completion, 'Completions', 9)

  expect(EditorStates.get(editorUid)?.newState).toMatchObject({
    additionalFocus: 0,
    focused: true,
    widgets: [],
  })
  expect(dispose).toHaveBeenCalledWith('Completions.dispose')
  expect(unsetAdditionalFocus).toHaveBeenCalledWith(9)
})
