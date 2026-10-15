import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>(async () => [])
jest.unstable_mockModule('../src/parts/RenameWorker/RenameWorker.ts', () => ({ invoke }))
jest.unstable_mockModule('../src/parts/ExtensionManagementEditor/ExtensionManagementEditor.ts', () => ({
  execute: async () => ({ placeholder: 'color' }),
}))
jest.unstable_mockModule('../src/parts/GetPositionAtCursor/GetPositionAtCursor.ts', () => ({
  getPositionAtCursor: () => ({ columnIndex: 5, rowIndex: 0 }),
}))
jest.unstable_mockModule('../src/parts/GetOffsetAtCursor/GetOffsetAtCursor.ts', () => ({ getOffsetAtCursor: () => 5 }))
jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandGetWordAt.ts', () => ({
  getWordAt: () => ({ word: 'color' }),
  getWordBefore: () => 'c',
}))
jest.unstable_mockModule('../src/parts/AddWidgetToEditor/AddWidgetToEditor.ts', () => ({
  addWidgetToEditor: async (_kind: unknown, _focus: unknown, editor: any, _create: unknown, generate: any) => {
    await generate({ height: 20, uid: 99, width: 100, x: 0, y: 0 }, editor.uid)
    return { ...editor, widgets: [] }
  },
}))
const { emptyEditor } = await import('../src/parts/EmptyEditor/EmptyEditor.ts')
const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const { openRename } = await import('../src/parts/EditorCommand/EditorCommandOpenRename.ts')
beforeEach(() => invoke.mockClear())

for (const applicationId of ['preview', undefined]) {
  test(`rename widget inherits its editor application ${String(applicationId)}`, async () => {
    const editor = { ...emptyEditor, applicationId, decorations: [], languageId: 'plaintext', uid: 42, widgets: [] }
    EditorStates.set(42, editor, editor)
    await openRename(editor)
    expect(invoke).toHaveBeenNthCalledWith(1, 'Rename.create', 99, 0, 0, 100, 20, 42, 'plaintext', applicationId)
  })
}
