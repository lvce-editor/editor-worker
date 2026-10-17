import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getEditorRowsVirtualDom } from '../src/parts/GetEditorRowsVirtualDom/GetEditorRowsVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

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
