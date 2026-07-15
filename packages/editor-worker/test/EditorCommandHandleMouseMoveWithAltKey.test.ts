import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as DecorationType from '../src/parts/DecorationType/DecorationType.ts'
import * as EditorCommandHandleMouseMoveWithAltKey from '../src/parts/EditorCommand/EditorCommandHandleMouseMoveWithAltKey.ts'

const createEditor = (lines: readonly string[], decorations: readonly number[] = []) => {
  return {
    charWidth: 10,
    decorations,
    deltaX: 0,
    deltaY: 0,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 400,
    isMonospaceFont: true,
    letterSpacing: 0,
    lines,
    rowHeight: 20,
    tabSize: 2,
    x: 0,
    y: 0,
  }
}

const definition = {
  endOffset: 6,
  startOffset: 0,
  uri: 'file:///definition.xyz',
}

test('handleMouseMoveWithAltKey - decorates the hovered word when a definition exists', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostDefinition.executeDefinitionProvider': async () => definition,
  })
  const editor = createEditor(['before target after'])

  const result = await EditorCommandHandleMouseMoveWithAltKey.handleMouseMoveWithAltKey(editor, 90, 10)

  expect(result.decorations).toEqual([7, 6, DecorationType.DefinitionLink, 0])
  expect(mockRpc.invocations[0][2]).toBe(9)
})

test('handleMouseMoveWithAltKey - computes offsets on later lines', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostDefinition.executeDefinitionProvider': async () => definition,
  })
  const editor = createEditor(['first', 'target'])

  const result = await EditorCommandHandleMouseMoveWithAltKey.handleMouseMoveWithAltKey(editor, 20, 25)

  expect(result.decorations).toEqual([6, 6, DecorationType.DefinitionLink, 0])
  expect(mockRpc.invocations[0][2]).toBe(8)
})

test('handleMouseMoveWithAltKey - preserves existing decorations', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostDefinition.executeDefinitionProvider': async () => definition,
  })
  const editor = createEditor(['target'], [10, 3, DecorationType.Link, 0])

  const result = await EditorCommandHandleMouseMoveWithAltKey.handleMouseMoveWithAltKey(editor, 20, 10)

  expect(result.decorations).toEqual([10, 3, DecorationType.Link, 0, 0, 6, DecorationType.DefinitionLink, 0])
})

test('handleMouseMoveWithAltKey - replaces a previous definition link', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostDefinition.executeDefinitionProvider': async () => definition,
  })
  const editor = createEditor(['before target'], [0, 6, DecorationType.DefinitionLink, 0])

  const result = await EditorCommandHandleMouseMoveWithAltKey.handleMouseMoveWithAltKey(editor, 90, 10)

  expect(result.decorations).toEqual([7, 6, DecorationType.DefinitionLink, 0])
})

test('handleMouseMoveWithAltKey - avoids another provider request within the decorated word', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostDefinition.executeDefinitionProvider': async () => definition,
  })
  const editor = createEditor(['target'], [0, 6, DecorationType.DefinitionLink, 0])

  const result = await EditorCommandHandleMouseMoveWithAltKey.handleMouseMoveWithAltKey(editor, 40, 10)

  expect(result).toBe(editor)
  expect(mockRpc.invocations).toEqual([])
})

test('handleMouseMoveWithAltKey - clears the previous link when there is no definition', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostDefinition.executeDefinitionProvider': async () => undefined,
  })
  const editor = createEditor(['target'], [10, 2, DecorationType.DefinitionLink, 0])

  const result = await EditorCommandHandleMouseMoveWithAltKey.handleMouseMoveWithAltKey(editor, 0, 10)

  expect(result.decorations).toEqual([])
})

test('handleMouseMoveWithAltKey - clears the previous link when no provider exists', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostDefinition.executeDefinitionProvider': async () => {
      throw new Error('Failed to execute definition provider: No definition provider found for plaintext')
    },
  })
  const editor = createEditor(['target'], [10, 2, DecorationType.DefinitionLink, 0])

  const result = await EditorCommandHandleMouseMoveWithAltKey.handleMouseMoveWithAltKey(editor, 0, 10)

  expect(result.decorations).toEqual([])
})

test('handleMouseMoveWithAltKey - does not request a definition over whitespace', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostDefinition.executeDefinitionProvider': async () => definition,
  })
  const editor = createEditor([' target'], [1, 6, DecorationType.DefinitionLink, 0])

  const result = await EditorCommandHandleMouseMoveWithAltKey.handleMouseMoveWithAltKey(editor, 0, 10)

  expect(result.decorations).toEqual([])
  expect(mockRpc.invocations).toEqual([])
})

test('handleMouseMoveWithAltKey - rethrows definition provider errors', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostDefinition.executeDefinitionProvider': async () => {
      throw new Error('provider failed')
    },
  })
  const editor = createEditor(['target'])

  await expect(EditorCommandHandleMouseMoveWithAltKey.handleMouseMoveWithAltKey(editor, 0, 10)).rejects.toThrow('provider failed')
})
