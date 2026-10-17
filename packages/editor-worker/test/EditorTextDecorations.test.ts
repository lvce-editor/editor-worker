import { expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { EditorState } from '../src/parts/State/State.ts'
import { getEditorTextDecorations, refreshTextDecorations } from '../src/parts/GetEditorTextDecorations/GetEditorTextDecorations.ts'
import { getTextDecorationsVirtualDom } from '../src/parts/GetTextDecorationsVirtualDom/GetTextDecorationsVirtualDom.ts'

const decoration = { color: '#ff0000', endColumnIndex: 3, endRowIndex: 1, startColumnIndex: 1, startRowIndex: 0 }
const editor = {
  charWidth: 8,
  deltaX: 0,
  deltaY: 0,
  fontFamily: 'monospace',
  fontSize: 14,
  fontWeight: 400,
  gutterWidth: 0,
  isMonospaceFont: true,
  languageId: 'plaintext',
  letterSpacing: 0,
  lines: ['first', 'second'],
  maxLineY: 2,
  minLineY: 0,
  rowHeight: 20,
  selections: new Uint32Array([1, 3, 0, 1]),
  tabSize: 2,
  uri: 'file:///test.txt',
  width: 800,
} as unknown as EditorState

test('queries normalized selections and replaces only extension text decorations', async () => {
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeProvidersByEvent': (event: string, command: string, document: { selections: unknown }) => {
      expect(event).toBe('onEditorTextDecoration')
      expect(command).toBe('ExtensionApi.executeEditorTextDecorationProvider')
      expect(document.selections).toEqual([{ endColumnIndex: 3, endRowIndex: 1, startColumnIndex: 1, startRowIndex: 0 }])
      return [[decoration], [{ ...decoration, color: '#00ff00' }]]
    },
  })
  const state = { ...editor, decorations: [0, 2, 1, 0], diagnostics: [{ message: 'diagnostic' }], gutterDecorations: [] }
  const result = await refreshTextDecorations(state)
  expect(result.textDecorations).toHaveLength(2)
  expect(result.decorations).toBe(state.decorations)
  expect(result.diagnostics).toBe(state.diagnostics)
  expect(result.gutterDecorations).toBe(state.gutterDecorations)
})

test('filters malformed, reversed, out-of-document and unsafe style results', async () => {
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeProvidersByEvent': () => [
      [
        decoration,
        null,
        { ...decoration, color: 'red;display:none' },
        { ...decoration, endRowIndex: 5 },
        { ...decoration, startColumnIndex: 10 },
        { ...decoration, thickness: Infinity },
        { ...decoration, endColumnIndex: 0, endRowIndex: 0 },
      ],
      null,
    ],
  })
  expect(await getEditorTextDecorations(editor)).toEqual([decoration])
})

test('renders multiline underlines with custom styling and no text changes', async () => {
  const dom = await getTextDecorationsVirtualDom({ ...editor, textDecorations: [decoration] })
  expect(dom.map(({ height, left, top, width }) => ({ height, left, top, width }))).toEqual([
    { height: 2, left: 8, top: 18, width: 32 },
    { height: 2, left: 0, top: 38, width: 24 },
  ])
  expect(editor.lines).toEqual(['first', 'second'])
})

test('empty ranges draw nothing and overlapping providers retain their own style', async () => {
  const empty = { ...decoration, endColumnIndex: 1, endRowIndex: 0 }
  const dom = await getTextDecorationsVirtualDom({
    ...editor,
    textDecorations: [empty, decoration, { ...decoration, color: '#0000ff', thickness: 1 }],
  })
  expect(dom).toHaveLength(4)
  expect(dom[2]).toEqual(expect.objectContaining({ className: 'EditorTextDecoration EditorTextDecoration2', height: 1 }))
})

test('clips horizontally scrolled underlines and excludes nonvisible rows', async () => {
  const dom = await getTextDecorationsVirtualDom({ ...editor, deltaX: 16, maxLineY: 2, minLineY: 1, textDecorations: [decoration] })
  expect(dom).toHaveLength(1)
  expect(dom[0]).toEqual(expect.objectContaining({ left: 0, top: 18, width: 8 }))
})

test('incremental editor DOM includes underlines alongside diagnostics and bracket matches', async () => {
  const { getEditorDiagnosticsVirtualDom } = await import('../src/parts/GetEditorDiagnosticsVirtualDom/GetEditorDiagnosticsVirtualDom.ts')
  const customDom = await getTextDecorationsVirtualDom({ ...editor, textDecorations: [decoration] })
  const dom = getEditorDiagnosticsVirtualDom([{ height: 20, type: 'error', width: 8, x: 0, y: 0 }], [{ height: 20, width: 8, x: 8, y: 0 }], customDom)
  expect(dom[0].childCount).toBe(4)
  expect(dom.some((node) => node.className === 'BracketMatch')).toBe(true)
  expect(dom.filter((node) => String(node.className).includes('EditorTextDecoration'))).toHaveLength(2)
})
