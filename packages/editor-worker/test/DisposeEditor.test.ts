import { expect, jest, test } from '@jest/globals'
import { WidgetId } from '@lvce-editor/constants'

jest.unstable_mockModule('../src/parts/ColorPickerWorker/ColorPickerWorker.ts', () => ({
  invoke: jest.fn(),
}))

const ColorPickerWorker = await import('../src/parts/ColorPickerWorker/ColorPickerWorker.ts')
const DisposeEditor = await import('../src/parts/DisposeEditor/DisposeEditor.ts')
const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const RegisterWidgets = await import('../src/parts/RegisterWidgets/RegisterWidgets.ts')

RegisterWidgets.registerWidgets()

test('disposes editor widgets and state', async () => {
  const editorUid = 900_001
  const editor = {
    uid: editorUid,
    widgets: [
      {
        id: WidgetId.ColorPicker,
        newState: { uid: 900_002 },
        oldState: { uid: 900_002 },
      },
    ],
  }
  EditorStates.set(editorUid, editor as any, editor as any)

  await expect(DisposeEditor.disposeEditor(editorUid)).resolves.toEqual([['Viewlet.dispose', 900_002]])
  expect(ColorPickerWorker.invoke).toHaveBeenCalledWith('ColorPicker.dispose', 900_002)
  expect(EditorStates.get(editorUid)).toBeUndefined()
})

test('does nothing when editor is already disposed', async () => {
  await expect(DisposeEditor.disposeEditor(900_003)).resolves.toEqual([])
})
