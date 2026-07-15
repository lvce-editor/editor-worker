import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as DecorationType from '../src/parts/DecorationType/DecorationType.ts'
import * as EditorCommandHandleMouseMove from '../src/parts/EditorCommand/EditorCommandHandleMouseMove.ts'

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
  x: 0,
  y: 0,
}

test('handleMouseMove - uses definition hover when Alt is pressed', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostDefinition.executeDefinitionProvider': async () => ({
      endOffset: 6,
      startOffset: 0,
      uri: 'file:///definition.xyz',
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
