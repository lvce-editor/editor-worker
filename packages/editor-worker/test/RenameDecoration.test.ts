import { expect, test } from '@jest/globals'
import * as DecorationType from '../src/parts/DecorationType/DecorationType.ts'
import * as RenameDecoration from '../src/parts/RenameDecoration/RenameDecoration.ts'

test('set - adds a rename decoration and preserves other decorations', () => {
  const editor = {
    decorations: [1, 3, DecorationType.Link, 0],
  }

  expect(RenameDecoration.set(editor, 8, 5)).toEqual({
    decorations: [1, 3, DecorationType.Link, 0, 8, 5, DecorationType.Rename, 0],
  })
})

test('set - replaces an existing rename decoration', () => {
  const editor = {
    decorations: [1, 3, DecorationType.Rename, 0],
  }

  expect(RenameDecoration.set(editor, 8, 5)).toEqual({
    decorations: [8, 5, DecorationType.Rename, 0],
  })
})

test('clear - removes rename decorations and preserves other decorations', () => {
  const editor = {
    decorations: [1, 3, DecorationType.Rename, 0, 8, 5, DecorationType.DefinitionLink, 0],
  }

  expect(RenameDecoration.clear(editor)).toEqual({
    decorations: [8, 5, DecorationType.DefinitionLink, 0],
  })
})
