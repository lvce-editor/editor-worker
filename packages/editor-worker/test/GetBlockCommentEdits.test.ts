import { expect, test } from '@jest/globals'
import * as GetBlockCommentEdits from '../src/parts/GetBlockCommentEdits/GetBlockCommentEdits.ts'
import * as TextDocument from '../src/parts/TextDocument/TextDocument.ts'

test('adds a block comment around the active line', () => {
  const editor = {
    lines: ['const value = 1'],
    selections: new Uint32Array([0, 6, 0, 6]),
  }

  const edits = GetBlockCommentEdits.getBlockCommentEdits(editor, ['/*', '*/'])

  expect(TextDocument.applyEdits(editor, edits)).toEqual(['/*const value = 1*/'])
})

test('removes a block comment around the active line', () => {
  const editor = {
    lines: ['/*const value = 1*/'],
    selections: new Uint32Array([0, 8, 0, 8]),
  }

  const edits = GetBlockCommentEdits.getBlockCommentEdits(editor, ['/*', '*/'])

  expect(TextDocument.applyEdits(editor, edits)).toEqual(['const value = 1'])
})
