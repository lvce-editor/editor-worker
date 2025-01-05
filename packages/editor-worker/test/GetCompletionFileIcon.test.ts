import { expect, test } from '@jest/globals'
import * as EditorCompletionType from '../src/parts/EditorCompletionType/EditorCompletionType.ts'
import * as GetCompletionFileIcon from '../src/parts/GetCompletionFileIcon/GetCompletionFileIcon.ts'

test('file', () => {
  const kind = EditorCompletionType.File
  expect(GetCompletionFileIcon.getCompletionFileIcon(kind)).toBe('')
})

test('folder', () => {
  const kind = EditorCompletionType.Folder
  expect(GetCompletionFileIcon.getCompletionFileIcon(kind)).toBe('')
})

test('other', () => {
  const kind = EditorCompletionType.Keyword
  expect(GetCompletionFileIcon.getCompletionFileIcon(kind)).toBe('')
})
