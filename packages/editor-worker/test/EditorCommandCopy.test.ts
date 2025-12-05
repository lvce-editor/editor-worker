import { beforeAll, expect, jest, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'

beforeAll(() => {
  // TODO remove this when using newer node version
  if (typeof DOMException === 'undefined') {
    // @ts-ignore
    globalThis.DOMException = globalThis.Error
  }
})

let writeTextSpy: jest.Mock | undefined

const mockRpc = MockRpc.create({
  commandMap: {},
  invoke: async (method: string, ...args: any[]) => {
    if (method === 'ClipBoard.writeText') {
      if (writeTextSpy) {
        return writeTextSpy(...args)
      }
      throw new Error('not implemented')
    }
    return undefined
  },
})
ExtensionHost.set(mockRpc)
RendererWorker.set(mockRpc)

const EditorCopy = await import('../src/parts/EditorCommand/EditorCommandCopy.ts')

beforeAll(() => {
  // Command.setLoad((moduleId) => {
  //   switch (moduleId) {
  //     case ModuleId.ClipBoard:
  //       return import('../src/parts/ClipBoard/ClipBoard.ipc.ts')
  //     default:
  //       throw new Error(`module not found ${moduleId}`)
  //   }
  // })
})

test('editorCopy', async () => {
  writeTextSpy = jest.fn().mockImplementation(() => {})
  const editor = {
    columnWidth: 9,
    completionTriggerCharacters: [],
    cursor: {
      columnIndex: 6,
      rowIndex: 3,
    },
    deltaY: 0,
    finalDeltaY: 0,
    finalY: 0,
    fontSize: 15,
    height: 645,
    languageId: 'plaintext',
    letterSpacing: 0.5,
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    maxLineY: 3,
    minLineY: 0,
    numberOfVisibleLines: 32,
    rowHeight: 20,
    scrollBarHeight: 0,
    selections: new Uint32Array([0, 0, 3, 6]),
    undoStack: [],
    uri: '/tmp/foo-fiiHjX/test.txt',
    x: 0,
    y: 55,
  }

  expect(await EditorCopy.copy(editor)).toBe(editor)
  expect(writeTextSpy).toHaveBeenCalledTimes(1)
  expect(writeTextSpy).toHaveBeenCalledWith('line 1\nline 2\nline 3')
})

test.skip('editorCopy - error from clipboard - document is not focused', async () => {
  writeTextSpy = jest.fn().mockImplementation(() => {
    throw new DOMException('Document is not focused.')
  })
  // @ts-ignore
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const editor = {
    columnWidth: 9,
    completionTriggerCharacters: [],
    cursor: {
      columnIndex: 6,
      rowIndex: 3,
    },
    deltaY: 0,
    finalDeltaY: 0,
    finalY: 0,
    fontSize: 15,
    height: 645,
    languageId: 'plaintext',
    letterSpacing: 0.5,
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    maxLineY: 3,
    minLineY: 0,
    numberOfVisibleLines: 32,
    rowHeight: 20,
    scrollBarHeight: 0,
    selections: new Uint32Array([0, 0, 3, 6]),
    undoStack: [],
    uri: '/tmp/foo-fiiHjX/test.txt',
    x: 0,
    y: 55,
  }
  await expect(EditorCopy.copy(editor)).rejects.toThrow(new DOMException('Document is not focused.'))
})
