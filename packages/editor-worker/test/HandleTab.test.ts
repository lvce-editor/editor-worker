import { beforeEach, expect, jest, test } from '@jest/globals'
import { ErrorWorker, ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

const mockEditorType = {
  type: jest.fn(async (editor: any, text: string) => ({
    ...editor,
    insertedText: text,
  })),
}

jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandType.ts', () => mockEditorType)

const HandleTab = await import('../src/parts/HandleTab/HandleTab.ts')

beforeEach(() => {
  mockEditorType.type.mockClear()
})

test('handleTab - indent selection', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['one', 'two', 'three'],
    minLineY: 0,
    modified: true,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 1, 1, 2]),
    undoStack: [],
  }

  expect(await HandleTab.handleTab(editor)).toMatchObject({
    lines: ['  one', '  two', 'three'],
  })
})

test('handleTab - no result inserts a tab', async () => {
  using extensionManagementWorkerRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeLanguageProvider': () => ({ found: false }),
  })
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['a'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
    undoStack: [],
  }
  const newEditor = await HandleTab.handleTab(editor)
  expect(newEditor).toEqual({
    ...editor,
    insertedText: '  ',
  })
  expect(mockEditorType.type).toHaveBeenCalledWith(editor, '  ')
  expect(extensionManagementWorkerRpc.invocations).toEqual([
    [
      'Extensions.executeLanguageProvider',
      'tab completion',
      'provideTabCompletion',
      {
        documentId: undefined,
        languageId: undefined,
        text: 'a',
        uri: undefined,
      },
      0,
    ],
  ])
})

test('handleTab - provider error logs the error and inserts a tab', async () => {
  const error = new Error('HTML extension failed')
  const prettyError = {
    codeFrame: undefined,
    message: error.message,
    stack: error.stack,
  }
  using extensionManagementWorkerRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeLanguageProvider': async () => {
      throw error
    },
  })
  using errorWorkerRpc = ErrorWorker.registerMockRpc({
    'Errors.prepare': async () => prettyError,
    'Errors.print': async () => undefined,
  })
  const editor = {
    lines: ['a'],
    selections: new Uint32Array([0, 0, 0, 0]),
  }

  const newEditor = await HandleTab.handleTab(editor)

  expect(newEditor).toEqual({
    ...editor,
    insertedText: '  ',
  })
  expect(mockEditorType.type).toHaveBeenCalledWith(editor, '  ')
  expect(extensionManagementWorkerRpc.invocations).toHaveLength(1)
  expect(errorWorkerRpc.invocations).toEqual([
    ['Errors.prepare', error],
    ['Errors.print', prettyError, 'Failed to execute tab completion provider: '],
  ])
})

test.skip('handleTab - apply result', async () => {
  // Skipped: Cannot spy on ES module exports (read-only properties)
  const getTabCompletionSpy = jest.spyOn(TabCompletion, 'getTabCompletion').mockResolvedValue({
    deleted: 6,
    inserted: '<button>$0</button>',
    type: 2,
  })
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['button'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
    undoStack: [],
  }
  const newEditor = await HandleTab.handleTab(editor)
  // TODO
  expect(newEditor.lines).toEqual(['<button></button>button'])
  getTabCompletionSpy.mockRestore()
})
