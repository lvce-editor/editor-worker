import { expect, test } from '@jest/globals'
import { getEditorBreadcrumbsVirtualDom } from '../src/parts/GetEditorBreadcrumbsVirtualDom/GetEditorBreadcrumbsVirtualDom.ts'

test('renders breadcrumb items separated by chevron icons', () => {
  const dom = getEditorBreadcrumbsVirtualDom({
    breadcrumbsEnabled: true,
    documentSymbols: [
      {
        endOffset: 12,
        kind: 5,
        name: 'App',
        selectionEndOffset: 9,
        selectionStartOffset: 6,
        startOffset: 0,
      },
    ],
    lines: ['class App {}'],
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 7, 0, 7]),
    uri: 'file:///workspace/src/App.ts',
    workspaceUri: 'file:///workspace',
  })

  expect(dom[0]).toEqual({
    ariaLabel: 'Breadcrumbs',
    childCount: 8,
    className: 'EditorBreadcrumbs',
    type: 40,
  })
  expect(dom.filter((node) => node.className?.includes('EditorBreadcrumbSeparator'))).toHaveLength(2)
  expect(dom).toContainEqual(expect.objectContaining({ className: 'EditorBreadcrumb EditorBreadcrumbSymbol', 'data-symbolKind': 5 }))
})

test('renders an empty breadcrumb row for an empty uri', () => {
  expect(
    getEditorBreadcrumbsVirtualDom({
      breadcrumbsEnabled: true,
      documentSymbols: [],
      lines: [],
      primarySelectionIndex: 0,
      selections: new Uint32Array(),
      uri: '',
      workspaceUri: '',
    }),
  ).toEqual([
    {
      ariaLabel: 'Breadcrumbs',
      childCount: 0,
      className: 'EditorBreadcrumbs',
      type: 40,
    },
  ])
})
