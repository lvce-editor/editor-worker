import { afterEach, expect, jest, test } from '@jest/globals'
import { ExtensionManagementWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as DecorationType from '../src/parts/DecorationType/DecorationType.ts'
import * as Editors from '../src/parts/EditorStates/EditorStates.ts'

const showHover = jest.fn(async (editor: any, _position: any) => ({
  ...editor,
  widgets: [{ id: 'hover' }],
}))

jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandShowHover.ts', () => ({
  showHover,
}))

const EditorCommandHandleMouseMove = await import('../src/parts/EditorCommand/EditorCommandHandleMouseMove.ts')

const editor = {
  charWidth: 10,
  decorations: [],
  deltaX: 0,
  deltaY: 0,
  fontFamily: 'monospace',
  fontSize: 14,
  fontWeight: 400,
  hoverEnabled: false,
  isMonospaceFont: true,
  letterSpacing: 0,
  lines: ['target'],
  rowHeight: 20,
  tabSize: 2,
  uid: 1,
  widgets: [],
  x: 0,
  y: 0,
}

afterEach(() => {
  jest.useRealTimers()
  showHover.mockClear()
  Editors.dispose(editor.uid)
})

test('handleMouseMove - uses definition hover when Alt is pressed', async () => {
  using _mockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeLanguageProvider': async () => ({
      found: true,
      result: {
        endOffset: 6,
        startOffset: 0,
        uri: 'file:///definition.xyz',
      },
    }),
  })

  const result = await EditorCommandHandleMouseMove.handleMouseMove(editor, 0, 10, true)

  expect(result.decorations).toEqual([0, 6, DecorationType.DefinitionLink, 0])
})

test('handleMouseMove - clears the definition link when Alt is not pressed', async () => {
  const editorWithDefinitionLink = {
    ...editor,
    decorations: [0, 6, DecorationType.DefinitionLink, 0],
  }

  const result = await EditorCommandHandleMouseMove.handleMouseMove(editorWithDefinitionLink, 0, 10, false)

  expect(result.decorations).toEqual([])
})

test('handleMouseMove - opens hover at the mouse position after the hover delay', async () => {
  jest.useFakeTimers()
  const editorWithHover = {
    ...editor,
    hoverEnabled: true,
  }
  Editors.set(editor.uid, editorWithHover as any, editorWithHover as any)
  using _mockRpc = RendererWorker.registerMockRpc({
    'Editor.renderPending': jest.fn(),
  })

  await EditorCommandHandleMouseMove.handleMouseMove(editorWithHover, 25, 10, false)
  await jest.advanceTimersByTimeAsync(300)

  expect(showHover).toHaveBeenCalledWith(
    editorWithHover,
    expect.objectContaining({
      columnIndex: expect.any(Number),
      rowIndex: 0,
    }),
  )
  expect(Editors.get(editor.uid).newState.widgets).toEqual([{ id: 'hover' }])
})
