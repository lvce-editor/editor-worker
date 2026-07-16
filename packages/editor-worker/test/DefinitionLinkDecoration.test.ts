import { expect, test } from '@jest/globals'
import * as DecorationType from '../src/parts/DecorationType/DecorationType.ts'
import * as DefinitionLinkDecoration from '../src/parts/DefinitionLinkDecoration/DefinitionLinkDecoration.ts'

test('set - adds a definition link decoration', () => {
  const editor = { decorations: [] }

  expect(DefinitionLinkDecoration.set(editor, 4, 6)).toEqual({
    decorations: [4, 6, DecorationType.DefinitionLink, 0],
  })
})

test('set - preserves other decorations', () => {
  const editor = { decorations: [1, 3, DecorationType.Link, 0] }

  expect(DefinitionLinkDecoration.set(editor, 8, 5)).toEqual({
    decorations: [1, 3, DecorationType.Link, 0, 8, 5, DecorationType.DefinitionLink, 0],
  })
})

test('set - replaces the previous definition link decoration', () => {
  const editor = { decorations: [1, 3, DecorationType.DefinitionLink, 0, 10, 2, DecorationType.Link, 0] }

  expect(DefinitionLinkDecoration.set(editor, 8, 5)).toEqual({
    decorations: [10, 2, DecorationType.Link, 0, 8, 5, DecorationType.DefinitionLink, 0],
  })
})

test('set - returns the same editor when the decoration already matches', () => {
  const editor = { decorations: [4, 6, DecorationType.DefinitionLink, 0] }

  expect(DefinitionLinkDecoration.set(editor, 4, 6)).toBe(editor)
})

test('clear - removes only definition link decorations', () => {
  const editor = { decorations: [1, 3, DecorationType.Link, 0, 4, 6, DecorationType.DefinitionLink, 0] }

  expect(DefinitionLinkDecoration.clear(editor)).toEqual({
    decorations: [1, 3, DecorationType.Link, 0],
  })
})

test('clear - returns the same editor when there is no definition link decoration', () => {
  const editor = { decorations: [1, 3, DecorationType.Link, 0] }

  expect(DefinitionLinkDecoration.clear(editor)).toBe(editor)
})

test('setRename - adds a rename decoration and preserves other decorations', () => {
  const editor = {
    decorations: [1, 3, DecorationType.Link, 0],
  }

  expect(DefinitionLinkDecoration.setRename(editor, 8, 5)).toEqual({
    decorations: [1, 3, DecorationType.Link, 0, 8, 5, DecorationType.Rename, 0],
  })
})

test('setRename - replaces an existing rename decoration', () => {
  const editor = {
    decorations: [1, 3, DecorationType.Rename, 0],
  }

  expect(DefinitionLinkDecoration.setRename(editor, 8, 5)).toEqual({
    decorations: [8, 5, DecorationType.Rename, 0],
  })
})

test('clearRename - removes rename decorations and preserves other decorations', () => {
  const editor = {
    decorations: [1, 3, DecorationType.Rename, 0, 8, 5, DecorationType.DefinitionLink, 0],
  }

  expect(DefinitionLinkDecoration.clearRename(editor)).toEqual({
    decorations: [8, 5, DecorationType.DefinitionLink, 0],
  })
})
