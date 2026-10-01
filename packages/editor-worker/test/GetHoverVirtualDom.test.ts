import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetHoverVirtualDom from '../src/parts/GetHoverVirtualDom/GetHoverVirtualDom.ts'

test('marks a single diagnostic as a diagnostic-only hover', () => {
  const dom = GetHoverVirtualDom.getHoverVirtualDom([], [], [{ message: 'Use const instead' }])

  expect(dom[0].className).toBe('Viewlet EditorHover EditorHoverDiagnosticOnly')
})

test('does not mark a hover with additional information as diagnostic-only', () => {
  const dom = GetHoverVirtualDom.getHoverVirtualDom([['const value = 1']], [], [{ message: 'Use const instead' }])

  expect(dom[0].className).toBe('Viewlet EditorHover')
})

test('adds editor pointer listeners and the editor uid to the hover root', () => {
  const dom = GetHoverVirtualDom.getHoverVirtualDom([], [], [], 42)

  expect(dom[0]).toEqual(
    expect.objectContaining({
      'data-editorUid': 42,
      onMouseOut: DomEventListenerFunctions.HandleMouseOut,
      onMouseOver: DomEventListenerFunctions.HandleMouseOver,
    }),
  )
})

test('keeps nested Markdown, multiline signatures, diagnostics and the sash as siblings', () => {
  const markdown = [
    { childCount: 2, className: 'Markdown', type: 4 },
    { childCount: 1, type: 4 },
    { childCount: 0, text: 'API guide', type: 12 },
    { childCount: 1, type: 4 },
    { childCount: 0, text: 'const answer = 42\n', type: 12 },
  ]
  const dom = GetHoverVirtualDom.getHoverVirtualDom(
    [
      ['first line', 'TokenText'],
      ['second line', 'TokenText'],
    ],
    markdown,
    [{ message: 'diagnostic' }],
  )
  const children = []
  let pending = 0
  for (const node of dom.slice(1)) {
    if (pending === 0) {
      children.push(node)
    } else {
      pending--
    }
    pending += node.childCount
  }
  expect(pending).toBe(0)
  expect(dom[0].childCount).toBe(4)
  expect(children.map((node) => node.className)).toEqual([
    'HoverDisplayString HoverProblem',
    'HoverDisplayString',
    'HoverDocumentation',
    'Sash SashVertical SashResize',
  ])
  expect(children[2].childCount).toBe(1)
  expect(dom).toEqual(expect.arrayContaining(markdown))
})
