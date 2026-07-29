import { afterEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>()
const readFile = jest.fn<(uri: string) => Promise<string>>()
const scheduleDocumentAndCursorsSelections = jest.fn<(editor: any, changes: readonly any[]) => Promise<any>>()

jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({
  RendererWorker: {
    invoke,
    readFile,
  },
}))

jest.unstable_mockModule('../src/parts/Editor/Editor.ts', () => ({
  scheduleDocumentAndCursorsSelections,
}))

const EditorCommandApplyWorkspaceEdit = await import('../src/parts/EditorCommand/EditorCommandApplyWorkspaceEdit.ts')
const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')

afterEach(() => {
  invoke.mockReset()
  readFile.mockReset()
  scheduleDocumentAndCursorsSelections.mockReset()
  for (const key of EditorStates.getKeys()) {
    EditorStates.dispose(Number(key))
  }
})

test('applyEditsToText applies offset edits without shifting later edits', () => {
  const text = 'const oldName = oldName'
  const edits = [
    {
      deleted: 7,
      inserted: 'newName',
      offset: 6,
    },
    {
      deleted: 7,
      inserted: 'newName',
      offset: 16,
    },
  ]

  expect(EditorCommandApplyWorkspaceEdit.applyEditsToText(text, edits)).toBe('const newName = newName')
})

test('applyWorkspaceEdit applies all edits for the current editor', async () => {
  const editor = {
    initial: false,
    lines: ['const oldName = oldName'],
    uid: 1,
    uri: 'file:///current.ts',
  }
  const updatedEditor = {
    ...editor,
    lines: ['const newName = newName'],
  }
  scheduleDocumentAndCursorsSelections.mockResolvedValue(updatedEditor)

  const result = await EditorCommandApplyWorkspaceEdit.applyWorkspaceEdit(editor, [
    {
      edits: [
        {
          deleted: 7,
          inserted: 'newName',
          offset: 6,
        },
      ],
      uri: editor.uri,
    },
    {
      edits: [
        {
          deleted: 7,
          inserted: 'newName',
          offset: 16,
        },
      ],
      uri: editor.uri,
    },
  ])

  expect(result).toBe(updatedEditor)
  expect(scheduleDocumentAndCursorsSelections).toHaveBeenCalledTimes(1)
  expect(scheduleDocumentAndCursorsSelections).toHaveBeenCalledWith(editor, [
    {
      deleted: ['oldName'],
      end: {
        columnIndex: 23,
        rowIndex: 0,
      },
      inserted: ['newName'],
      origin: 'rename',
      start: {
        columnIndex: 16,
        rowIndex: 0,
      },
    },
    {
      deleted: ['oldName'],
      end: {
        columnIndex: 13,
        rowIndex: 0,
      },
      inserted: ['newName'],
      origin: 'rename',
      start: {
        columnIndex: 6,
        rowIndex: 0,
      },
    },
  ])
})

test('applyWorkspaceEdit updates closed files on disk', async () => {
  const editor = {
    initial: false,
    lines: ['oldName'],
    uid: 1,
    uri: 'file:///current.ts',
  }
  readFile.mockResolvedValue('export const oldName = 1')

  const result = await EditorCommandApplyWorkspaceEdit.applyWorkspaceEdit(editor, [
    {
      edits: [
        {
          deleted: 7,
          inserted: 'newName',
          offset: 13,
        },
      ],
      uri: 'file:///target.ts',
    },
  ])

  expect(result).toBe(editor)
  expect(readFile).toHaveBeenCalledWith('file:///target.ts')
  expect(invoke).toHaveBeenCalledWith('FileSystem.writeFile', 'file:///target.ts', 'export const newName = 1')
})

test('applyWorkspaceEdit updates another open editor without writing it to disk', async () => {
  const currentEditor = {
    initial: false,
    lines: ['oldName'],
    uid: 1,
    uri: 'file:///current.ts',
  }
  const otherEditor = {
    initial: false,
    lines: ['export const oldName = 1'],
    uid: 2,
    uri: 'file:///target.ts',
  }
  EditorStates.set(otherEditor.uid, otherEditor as any, otherEditor as any)
  scheduleDocumentAndCursorsSelections.mockResolvedValue({
    ...otherEditor,
    lines: ['export const newName = 1'],
  })

  const result = await EditorCommandApplyWorkspaceEdit.applyWorkspaceEdit(currentEditor, [
    {
      edits: [
        {
          deleted: 7,
          inserted: 'newName',
          offset: 13,
        },
      ],
      uri: otherEditor.uri,
    },
  ])

  expect(result).toBe(currentEditor)
  expect(scheduleDocumentAndCursorsSelections).toHaveBeenCalledWith(otherEditor, [
    {
      deleted: ['oldName'],
      end: {
        columnIndex: 20,
        rowIndex: 0,
      },
      inserted: ['newName'],
      origin: 'rename',
      start: {
        columnIndex: 13,
        rowIndex: 0,
      },
    },
  ])
  expect(readFile).not.toHaveBeenCalled()
  expect(invoke).not.toHaveBeenCalled()
})
