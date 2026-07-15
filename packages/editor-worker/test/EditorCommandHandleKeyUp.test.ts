import { expect, test } from '@jest/globals'
import * as DecorationType from '../src/parts/DecorationType/DecorationType.ts'
import * as EditorCommandHandleKeyUp from '../src/parts/EditorCommand/EditorCommandHandleKeyUp.ts'

test('handleKeyUp - clears the definition link when Alt is released', () => {
  const editor = {
    decorations: [0, 6, DecorationType.DefinitionLink, 0],
  }

  expect(EditorCommandHandleKeyUp.handleKeyUp(editor, 'Alt')).toEqual({
    decorations: [],
  })
})

test('handleKeyUp - ignores other keys', () => {
  const editor = {
    decorations: [0, 6, DecorationType.DefinitionLink, 0],
  }

  expect(EditorCommandHandleKeyUp.handleKeyUp(editor, 'Shift')).toBe(editor)
})
