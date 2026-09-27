import { afterEach, expect, jest, test } from '@jest/globals'

const showDiagnostic = jest.fn(async (editor: any, _diagnostic: any) => editor)

jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandShowHover.ts', () => ({
  showDiagnostic,
}))

const EditorCommandNavigateDiagnostic = await import('../src/parts/EditorCommand/EditorCommandNavigateDiagnostic.ts')

const diagnostic = {
  code: 2322,
  columnIndex: 11,
  endColumnIndex: 17,
  endRowIndex: 2,
  message: "Type 'number' is not assignable to type 'string'.",
  rowIndex: 2,
  source: 'ts',
  type: 'error',
  uri: 'file:///test.ts',
}

const editor = {
  diagnostics: [diagnostic],
  selections: new Uint32Array([0, 0, 0, 0]),
}

afterEach(() => {
  showDiagnostic.mockClear()
})

test('selects and presents the next diagnostic', async () => {
  const result = await EditorCommandNavigateDiagnostic.nextDiagnostic(editor)

  expect(result.selections).toEqual(new Uint32Array([2, 11, 2, 17]))
  expect(result.problemNavigationDiagnostic).toBe(diagnostic)
  expect(showDiagnostic).toHaveBeenCalledWith(expect.objectContaining({ selections: new Uint32Array([2, 11, 2, 17]) }), diagnostic)
})

test('leaves the editor unchanged when there are no diagnostics', async () => {
  const editorWithoutDiagnostics = {
    ...editor,
    diagnostics: [],
  }

  await expect(EditorCommandNavigateDiagnostic.previousDiagnostic(editorWithoutDiagnostics)).resolves.toBe(editorWithoutDiagnostics)
  expect(showDiagnostic).not.toHaveBeenCalled()
})
