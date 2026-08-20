import { expect, test } from '@jest/globals'
import { getEditorBreadcrumbs } from '../src/parts/GetEditorBreadcrumbs/GetEditorBreadcrumbs.ts'

const documentSymbols = [
  {
    children: [
      {
        endOffset: 33,
        kind: 'method',
        name: 'render',
        selectionEndOffset: 20,
        selectionStartOffset: 14,
        startOffset: 14,
      },
    ],
    endOffset: 35,
    kind: 'class',
    name: 'App',
    selectionEndOffset: 9,
    selectionStartOffset: 6,
    startOffset: 0,
  },
]

const createState = (overrides: Record<string, unknown> = {}) => ({
  breadcrumbsEnabled: true,
  documentSymbols,
  lines: ['class App {', '  render() {}', '}', '', 'const outside = 1'],
  primarySelectionIndex: 0,
  selections: new Uint32Array([1, 4, 1, 4]),
  uri: 'file:///workspace/src/components/App.ts',
  workspaceUri: 'file:///workspace',
  ...overrides,
})

test('returns no breadcrumbs when disabled', () => {
  expect(getEditorBreadcrumbs(createState({ breadcrumbsEnabled: false }))).toEqual([])
})

test('returns workspace-relative file breadcrumbs', () => {
  expect(getEditorBreadcrumbs(createState({ documentSymbols: [] }))).toEqual([
    { kind: 'file', label: 'src' },
    { kind: 'file', label: 'components' },
    { kind: 'file', label: 'App.ts' },
  ])
})

test('appends the complete active symbol hierarchy', () => {
  expect(getEditorBreadcrumbs(createState())).toEqual([
    { kind: 'file', label: 'src' },
    { kind: 'file', label: 'components' },
    { kind: 'file', label: 'App.ts' },
    { kind: 'symbol', label: 'App', symbolKind: 'class' },
    { kind: 'symbol', label: 'render', symbolKind: 'method' },
  ])
})

test('shows only the containing parent outside a nested symbol', () => {
  const selections = new Uint32Array([0, 1, 0, 1])
  expect(getEditorBreadcrumbs(createState({ selections }))).toEqual([
    { kind: 'file', label: 'src' },
    { kind: 'file', label: 'components' },
    { kind: 'file', label: 'App.ts' },
    { kind: 'symbol', label: 'App', symbolKind: 'class' },
  ])
})

test('omits symbols when the cursor is outside their ranges', () => {
  const selections = new Uint32Array([4, 10, 4, 10])
  expect(getEditorBreadcrumbs(createState({ selections }))).toEqual([
    { kind: 'file', label: 'src' },
    { kind: 'file', label: 'components' },
    { kind: 'file', label: 'App.ts' },
  ])
})

test('falls back to the file name outside a workspace', () => {
  expect(
    getEditorBreadcrumbs(
      createState({
        documentSymbols: [],
        uri: 'file:///other/project/Example.ts',
      }),
    ),
  ).toEqual([{ kind: 'file', label: 'Example.ts' }])
})

test('decodes breadcrumb path segments', () => {
  expect(
    getEditorBreadcrumbs(
      createState({
        documentSymbols: [],
        uri: 'file:///workspace/my%20folder/Example.ts',
      }),
    ),
  ).toEqual([
    { kind: 'file', label: 'my folder' },
    { kind: 'file', label: 'Example.ts' },
  ])
})
