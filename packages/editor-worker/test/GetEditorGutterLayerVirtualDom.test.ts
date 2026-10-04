import { expect, test } from '@jest/globals'
import * as GetEditorGutterLayerVirtualDom from '../src/parts/GetEditorGutterLayerVirtualDom/GetEditorGutterLayerVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('renders frozen gutter infos without mutating them', () => {
  const gutterDecoration = Object.freeze({ rowIndex: 1, type: 'added' })
  const gutterDecorations = Object.freeze([gutterDecoration])
  const gutterInfo = Object.freeze({ gutterDecorations, lineNumber: 2, showLineNumber: true })
  const gutterInfos = Object.freeze([gutterInfo])

  expect(GetEditorGutterLayerVirtualDom.getEditorGutterVirtualDom(gutterInfos, 2, true)).toEqual([
    { childCount: 1, className: 'Gutter EditorBreadcrumbsOffset', type: VirtualDomElements.Div },
    { childCount: 1, className: 'GutterRows', type: VirtualDomElements.Div },
    { childCount: 2, className: 'LineNumber LineNumberActive', type: VirtualDomElements.Span },
    {
      ariaLabel: 'Added line 2',
      childCount: 0,
      className: 'EditorGutterDecoration EditorGutterDecorationAdded',
      title: 'Added line 2',
      type: VirtualDomElements.Span,
    },
    { childCount: 0, text: 2, type: VirtualDomElements.Text },
  ])
})
