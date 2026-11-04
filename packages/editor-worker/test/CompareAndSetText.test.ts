import { expect, jest, test } from '@jest/globals'

const scheduleDocumentAndCursorsSelections = jest.fn(async (editor: any, changes: any) => ({ ...editor, appliedChanges: changes }))
jest.unstable_mockModule('../src/parts/Editor/Editor.ts', () => ({ scheduleDocumentAndCursorsSelections }))
const { compareAndSetText } = await import('../src/parts/CompareAndSetText/CompareAndSetText.ts')

const editor: any = { applicationId: 'source', lines: ['original'], uid: 1, uri: 'memfs:///project/file.ts' }

test('replaces the expected document contents through the normal edit pipeline', async () => {
  const result = await compareAndSetText(editor, editor.uri, 'original', 'updated', 'source')
  expect(result).toMatchObject({ appliedChanges: [{ deleted: ['original'], inserted: ['updated'] }] })
})

test('rejects stale text before scheduling any edit', async () => {
  scheduleDocumentAndCursorsSelections.mockClear()
  await expect(compareAndSetText(editor, editor.uri, 'older contents', 'updated', 'source')).rejects.toThrow('File changed since it was read')
  expect(scheduleDocumentAndCursorsSelections).not.toHaveBeenCalled()
})

test.each([
  ['memfs:///project/other.ts', 'source'],
  ['memfs:///project/file.ts', 'preview'],
  ['memfs:///project/file.ts', ''],
  ['memfs:///project/file.ts', undefined],
])('rejects a changed URI or application ownership', async (uri, applicationId) => {
  scheduleDocumentAndCursorsSelections.mockClear()
  await expect(compareAndSetText(editor, uri, 'original', 'updated', applicationId)).rejects.toThrow('no longer belongs')
  expect(scheduleDocumentAndCursorsSelections).not.toHaveBeenCalled()
})

test('conditionally edits a legacy window document without authorizing application-owned documents', async () => {
  const legacy = { ...editor, applicationId: undefined }
  const result = await compareAndSetText(legacy, legacy.uri, 'original', 'updated', undefined)
  expect(result).toMatchObject({ appliedChanges: [{ deleted: ['original'], inserted: ['updated'] }] })
  scheduleDocumentAndCursorsSelections.mockClear()
  await expect(compareAndSetText(legacy, legacy.uri, 'original', 'updated', 'source')).rejects.toThrow('no longer belongs')
  expect(scheduleDocumentAndCursorsSelections).not.toHaveBeenCalled()
})
