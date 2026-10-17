import { afterEach, expect, test } from '@jest/globals'
import { createStandaloneEditor } from '../src/parts/CreateStandaloneEditor/CreateStandaloneEditor.ts'
import { diff2 } from '../src/parts/Diff2/Diff2.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { render2 } from '../src/parts/Render2/Render2.ts'
import * as RenderedDoms from '../src/parts/RenderedDoms/RenderedDoms.ts'

afterEach(() => {
  EditorStates.dispose(904)
  RenderedDoms.clear()
})

test('renders diagnostics cleared between the diff and render RPC calls', async () => {
  const id = 904
  await createStandaloneEditor({
    assetDir: '/assets',
    charWidth: 9,
    content: 'debugger;',
    fontFamily: 'monospace',
    fontSize: 15,
    fontWeight: 400,
    height: 600,
    id,
    languageId: 'javascript',
    letterSpacing: 0,
    lineNumbers: false,
    platform: 2,
    rowHeight: 20,
    tabSize: 2,
    tokenizePath: '',
    uri: 'memfs:///sample/main.ts',
    width: 800,
    x: 0,
    y: 0,
  })
  render2(id, diff2(id))
  const editor = EditorStates.get(id).newState
  const diagnostic = { columnIndex: 0, endColumnIndex: 8, endRowIndex: 0, message: 'Unexpected debugger', rowIndex: 0, type: 'error' }
  const withDiagnostics = {
    ...editor,
    diagnostics: [diagnostic],
    visualDecorations: [{ height: 2, type: 'error', width: 72, x: 0, y: 18 }],
  }
  EditorStates.set(id, editor, withDiagnostics)
  render2(id, diff2(id))
  expect(RenderedDoms.get(id)?.some((node) => node.className?.includes('DiagnosticError'))).toBe(true)

  const pendingDiff = diff2(id)
  expect(pendingDiff).toEqual([])
  const cleared = { ...withDiagnostics, diagnostics: [], visualDecorations: [] }
  EditorStates.set(id, withDiagnostics, cleared)
  const commands = render2(id, pendingDiff)

  expect(commands).toEqual([['Viewlet.setPatches', id, expect.any(Array)]])
  expect(RenderedDoms.get(id)?.some((node) => node.className?.includes('DiagnosticError'))).toBe(false)
})
