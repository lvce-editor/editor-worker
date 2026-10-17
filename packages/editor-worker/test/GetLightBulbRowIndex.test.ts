import { expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { getLightBulbRowIndex } from '../src/parts/GetLightBulbRowIndex/GetLightBulbRowIndex.ts'

const diagnostic = {
  code: 1,
  columnIndex: 23,
  endColumnIndex: 23,
  endRowIndex: 2,
  message: 'Missing semicolon',
  rowIndex: 2,
  source: 'eslint',
  type: 'error',
  uri: 'file:///workspace/main.ts',
}

const createEditor = (overrides: Record<string, unknown> = {}): any => ({
  diagnostics: [diagnostic],
  languageId: 'typescript',
  lines: ['const first = 1', '', 'const foo: string = 123'],
  selections: new Uint32Array([2, 23, 2, 23]),
  uid: 42,
  uri: 'file:///workspace/main.ts',
  ...overrides,
})

test('returns the diagnostic row when a code action exists', async () => {
  const invocations: unknown[] = []
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeCodeActionProviders'(...args: readonly unknown[]) {
      invocations.push(args)
      return [{ kind: 'quickfix', name: "Fix 'semi' problem" }]
    },
  })

  await expect(getLightBulbRowIndex(createEditor())).resolves.toBe(2)
  expect(invocations).toEqual([
    [
      {
        documentId: 42,
        languageId: 'typescript',
        text: 'const first = 1\n\nconst foo: string = 123',
        uri: 'file:///workspace/main.ts',
      },
      40,
    ],
  ])
})

test('returns no row when the provider has no actions', async () => {
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeCodeActionProviders'() {
      return []
    },
  })

  await expect(getLightBulbRowIndex(createEditor())).resolves.toBe(-1)
})

test('returns no row when a provider fails', async () => {
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeCodeActionProviders'() {
      throw new Error('Provider unavailable')
    },
  })

  await expect(getLightBulbRowIndex(createEditor())).resolves.toBe(-1)
})

test('does not query providers away from diagnostics', async () => {
  const invocations: unknown[] = []
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeCodeActionProviders'(...args: readonly unknown[]) {
      invocations.push(args)
      return [{ name: 'Unexpected' }]
    },
  })

  const editor = createEditor({ selections: new Uint32Array([0, 0, 0, 0]) })
  const rowIndex = await getLightBulbRowIndex(editor)
  expect(rowIndex).toBe(-1)
  expect(invocations).toEqual([])
})

test('does not show a bulb for a range selection or multiple cursors', async () => {
  const rangeEditor = createEditor({ selections: new Uint32Array([2, 20, 2, 23]) })
  const multiCursorEditor = createEditor({ selections: new Uint32Array([2, 23, 2, 23, 0, 0, 0, 0]) })
  expect(await getLightBulbRowIndex(rangeEditor)).toBe(-1)
  expect(await getLightBulbRowIndex(multiCursorEditor)).toBe(-1)
})
