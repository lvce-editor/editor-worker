import type { DocumentSymbol } from '../DocumentSymbol/DocumentSymbol.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export interface EditorBreadcrumb {
  readonly kind: 'file' | 'symbol'
  readonly label: string
  readonly symbolKind?: number | string
}

export interface EditorBreadcrumbState {
  readonly breadcrumbsEnabled: boolean
  readonly documentSymbols: readonly DocumentSymbol[]
  readonly lines: readonly string[]
  readonly primarySelectionIndex: number
  readonly selections: Uint32Array
  readonly uri: string
  readonly workspaceUri: string
}

const getPathname = (uri: string): string => {
  return decodeURIComponent(URL.canParse(uri) ? new URL(uri).pathname : uri)
}

const getFileBreadcrumbs = (uri: string, workspaceUri: string): readonly EditorBreadcrumb[] => {
  const path = getPathname(uri)
  const workspacePath = workspaceUri ? getPathname(workspaceUri).replace(/\/$/, '') : ''
  const relativePath =
    workspacePath && (path === workspacePath || path.startsWith(`${workspacePath}/`))
      ? path.slice(workspacePath.length + 1)
      : path.split('/').at(-1) || path
  return relativePath
    .split('/')
    .filter(Boolean)
    .map((label) => ({ kind: 'file', label }))
}

const containsOffset = (symbol: DocumentSymbol, offset: number): boolean => {
  return Number.isFinite(symbol.startOffset) && Number.isFinite(symbol.endOffset) && symbol.startOffset <= offset && offset <= symbol.endOffset
}

const getSymbolBreadcrumbs = (symbols: readonly DocumentSymbol[], offset: number): readonly EditorBreadcrumb[] => {
  for (const symbol of symbols) {
    if (!symbol || typeof symbol.name !== 'string' || !containsOffset(symbol, offset)) {
      continue
    }
    return [
      {
        kind: 'symbol',
        label: symbol.name,
        symbolKind: symbol.kind,
      },
      ...getSymbolBreadcrumbs(Array.isArray(symbol.children) ? symbol.children : [], offset),
    ]
  }
  return []
}

export const getEditorBreadcrumbs = (state: EditorBreadcrumbState): readonly EditorBreadcrumb[] => {
  const { breadcrumbsEnabled, documentSymbols, lines, primarySelectionIndex, selections, uri, workspaceUri } = state
  if (!breadcrumbsEnabled) {
    return []
  }
  const selectionIndex = primarySelectionIndex || 0
  const rowIndex = selections[selectionIndex + 2] ?? selections[selectionIndex] ?? 0
  const columnIndex = selections[selectionIndex + 3] ?? selections[selectionIndex + 1] ?? 0
  const offset = TextDocument.offsetAt({ lines }, rowIndex, columnIndex)
  return [...getFileBreadcrumbs(uri, workspaceUri || ''), ...getSymbolBreadcrumbs(documentSymbols || [], offset)]
}
