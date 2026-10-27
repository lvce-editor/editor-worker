import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getEditorRowsVirtualDom } from '../src/parts/GetEditorRowsVirtualDom/GetEditorRowsVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('ordinary tokens preserve text and classes without emitting empty token spans', () => {
  const dom = getEditorRowsVirtualDom([['', 'Token Empty', 'selectiontarget', 'Token PlainText', ' ', 'Token Whitespace']], [0])

  expect(dom[0].childCount).toBe(2)
  expect(dom.filter((node) => node.type === VirtualDomElements.Span).map((node) => node.className)).toEqual(['Token PlainText', 'Token Whitespace'])
  expect(dom.filter((node) => node.type === VirtualDomElements.Text).map((node) => node.text)).toEqual(['selectiontarget', ' '])
})

test('renders merge conflict actions as a dedicated view row', () => {
  const dom = getEditorRowsVirtualDom(
    [
      ['<<<<<<< HEAD', 'Token'],
      ['current', 'Token'],
    ],
    [0, 0],
    true,
    -1,
    [1, 2],
    [],
    [-2, 1, 2],
  )

  expect(dom[0]).toEqual({
    childCount: 3,
    className: 'MergeConflictActions',
    'data-rowIndex': 1,
    onMouseDown: DomEventListenerFunctions.HandleMergeConflictActionsMouseDown,
    type: VirtualDomElements.Div,
  })
  expect(dom.filter((node) => node.className === 'MergeConflictAction')).toEqual([
    expect.objectContaining({ 'data-action': 'current', 'data-rowIndex': 1, onClick: DomEventListenerFunctions.HandleMergeConflictActionClick }),
    expect.objectContaining({ 'data-action': 'incoming', 'data-rowIndex': 1, onClick: DomEventListenerFunctions.HandleMergeConflictActionClick }),
    expect.objectContaining({ 'data-action': 'both', 'data-rowIndex': 1, onClick: DomEventListenerFunctions.HandleMergeConflictActionClick }),
  ])
  expect(dom.filter((node) => node.className === 'EditorRow')).toHaveLength(2)
})

test('dims only the unnecessary portion of a token while preserving its syntax class', () => {
  const dom = getEditorRowsVirtualDom([['const unusedValue = 1', 'Token TokenVariable']], [0], true, -1, [], [], [], -1, [
    { columnIndex: 6, endColumnIndex: 17, endRowIndex: 0, rowIndex: 0, tags: [1] },
  ])

  expect(dom[0].childCount).toBe(3)
  expect(dom.filter((node) => node.type === VirtualDomElements.Span).map((node) => node.className)).toEqual([
    'Token TokenVariable',
    'Token TokenVariable EditorTokenUnnecessary',
    'Token TokenVariable',
  ])
  expect(dom.filter((node) => node.text !== undefined).map((node) => node.text)).toEqual(['const ', 'unusedValue', ' = 1'])
})

test('keeps ordinary diagnostics and unrelated tags at normal token opacity', () => {
  const dom = getEditorRowsVirtualDom([['warning', 'Token TokenString']], [0], true, -1, [], [], [], -1, [
    { columnIndex: 0, endColumnIndex: 7, endRowIndex: 0, rowIndex: 0, tags: [2] },
  ])

  expect(dom.find((node) => node.type === VirtualDomElements.Span)?.className).toBe('Token TokenString')
})

test('cached ordinary rows reuse nodes and notice token text and class changes in place', () => {
  const tokens = ['before', 'Token PlainText']
  const first = getEditorRowsVirtualDom([tokens], [0])
  const repeated = getEditorRowsVirtualDom([tokens], [0])
  expect(repeated[0]).toBe(first[0])
  expect(repeated[2]).toBe(first[2])

  tokens[0] = 'after'
  tokens[1] = 'Token String'
  const updated = getEditorRowsVirtualDom([tokens], [0])
  expect(updated[1].className).toBe('Token String')
  expect(updated[2].text).toBe('after')
  expect(first[2].text).toBe('before')
})

test('cached rows update scrolling and highlights without mutating the previous render', () => {
  const tokens = ['text', 'Token']
  const first = getEditorRowsVirtualDom([tokens], [0])
  const updated = getEditorRowsVirtualDom([tokens], [18], true, 0, [], [], [], 0)
  expect(updated[0].translate).toBe('18px')
  expect(updated[0].className).toContain('EditorRowHighlighted')
  expect(updated[0].className).toContain('EditorProblemsHighlightedRow')
  expect(first[0].translate).toBe('')
  expect(first[0].className).toBe('EditorRow')
})

test('diagnostics and end-of-line decorations bypass a previously cached ordinary row', () => {
  const tokens = ['const unusedValue = 1', 'Token Variable']
  getEditorRowsVirtualDom([tokens], [0])
  const diagnostic = getEditorRowsVirtualDom([tokens], [0], true, -1, [], [], [], -1, [
    { columnIndex: 6, endColumnIndex: 17, endRowIndex: 0, rowIndex: 0, tags: [1] },
  ])
  expect(diagnostic[0].childCount).toBe(3)
  expect(diagnostic.filter((node) => node.text !== undefined).map((node) => node.text)).toEqual(['const ', 'unusedValue', ' = 1'])
  const decorated = getEditorRowsVirtualDom([tokens], [0], true, -1, [], [{ rowIndex: 0, text: 'hint' }])
  expect(decorated[0].childCount).toBe(2)
  expect(decorated.some((node) => node.className === 'EditorLineDecoration')).toBe(true)
})

test('bidi layout bypasses a previously cached left-to-right row', () => {
  const line = 'abc אבג'
  const tokens = [line, 'Token']
  getEditorRowsVirtualDom([tokens], [0])
  const bidi = getEditorRowsVirtualDom([tokens], [0], true, -1, [], [], [], -1, [], 0, Infinity, 1, 2, [line], 500, [], true)
  expect(bidi.some((node) => node.className?.includes('EditorBidiRun'))).toBe(true)
})
