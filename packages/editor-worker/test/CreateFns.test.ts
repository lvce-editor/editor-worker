import { expect, jest, test } from '@jest/globals'
import { WidgetId } from '@lvce-editor/constants'

const invoke = jest.fn<(...args: any[]) => Promise<void>>()

jest.unstable_mockModule('../src/parts/GetWidgetInvoke/GetWidgetInvoke.ts', () => ({
  getWidgetInvoke: jest.fn(() => invoke),
}))

const Editors = await import('../src/parts/EditorStates/EditorStates.ts')
const CreateFns = await import('../src/parts/CreateFns/CreateFns.ts')

const editorUid = 901
const widgetUid = 902

test('accept preserves an editor transition that removed the widget', async () => {
  const originalEditor = {
    uid: editorUid,
    widgets: [
      {
        id: WidgetId.Rename,
        newState: {
          uid: widgetUid,
        },
      },
    ],
  }
  const editorWithoutRename = {
    ...originalEditor,
    widgets: [],
  }
  Editors.set(editorUid, originalEditor as any, originalEditor as any)
  invoke.mockImplementation(async (method: string, ..._args: any[]) => {
    if (method === 'Rename.accept') {
      Editors.set(editorUid, originalEditor as any, editorWithoutRename as any)
    }
  })
  const { accept } = CreateFns.createFns(['accept'], 'Rename', WidgetId.Rename)

  await expect(accept(editorUid)).resolves.toBe(editorWithoutRename)
  expect(invoke).toHaveBeenCalledTimes(1)
  expect(invoke).toHaveBeenCalledWith('Rename.accept', widgetUid)
  expect(Editors.get(editorUid).oldState).toBe(originalEditor)
  expect(Editors.get(editorUid).newState).toBe(editorWithoutRename)
})
