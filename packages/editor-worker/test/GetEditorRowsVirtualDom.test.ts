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
