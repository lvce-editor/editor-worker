import { expect, test } from '@jest/globals'
import * as GetEditorGutterVirtualDom from '../src/parts/GetEditorGutterVirtualDom/GetEditorGutterVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('renders the primary cursor line number as active', () => {
  expect(GetEditorGutterVirtualDom.getEditorGutterVirtualDom([1, 2], 2)).toEqual([
    {
      childCount: 1,
      className: 'LineNumber',
      type: VirtualDomElements.Span,
    },
    {
      childCount: 0,
      text: 1,
      type: VirtualDomElements.Text,
    },
    {
      childCount: 1,
      className: 'LineNumber LineNumberActive',
      type: VirtualDomElements.Span,
    },
    {
      childCount: 0,
      text: 2,
      type: VirtualDomElements.Text,
    },
  ])
})

test('renders a breakpoint marker', () => {
  expect(
    GetEditorGutterVirtualDom.getEditorGutterVirtualDom([
      {
        isBreakpoint: true,
        lineNumber: 2,
      },
    ]),
  ).toEqual([
    {
      ariaLabel: 'Breakpoint on line 2',
      childCount: 1,
      className: 'LineNumber LineNumberBreakpoint',
      style: 'color:var(--DebugIconBreakpointForeground,#e51400)',
      title: 'Breakpoint on line 2',
      type: VirtualDomElements.Span,
    },
    {
      childCount: 0,
      text: '●',
      type: VirtualDomElements.Text,
    },
  ])
})

test('renders an accessible clickable lightbulb', () => {
  expect(
    GetEditorGutterVirtualDom.getEditorGutterVirtualDom([
      {
        isBreakpoint: false,
        isLightBulb: true,
        lineNumber: 3,
      },
    ]),
  ).toEqual([
    {
      ariaLabel: 'Show Code Actions on line 3',
      childCount: 1,
      className: 'LineNumber LineNumberLightBulb MaskIconLightBulb',
      onClick: 35,
      role: 'button',
      title: 'Show Code Actions on line 3',
      type: VirtualDomElements.Span,
    },
    {
      childCount: 0,
      text: '',
      type: VirtualDomElements.Text,
    },
  ])
})

test('renders accessible added and modified gutter decorations', () => {
  expect(
    GetEditorGutterVirtualDom.getEditorGutterVirtualDom([
      {
        gutterDecorations: [
          { rowIndex: 1, type: 'added' },
          { rowIndex: 1, type: 'modified' },
        ],
        lineNumber: 2,
        showLineNumber: true,
      },
    ]),
  ).toEqual([
    {
      childCount: 3,
      className: 'LineNumber',
      type: VirtualDomElements.Span,
    },
    {
      ariaLabel: 'Added line 2',
      childCount: 0,
      className: 'EditorGutterDecoration EditorGutterDecorationAdded',
      title: 'Added line 2',
      type: VirtualDomElements.Span,
    },
    {
      ariaLabel: 'Modified line 2',
      childCount: 0,
      className: 'EditorGutterDecoration EditorGutterDecorationModified',
      title: 'Modified line 2',
      type: VirtualDomElements.Span,
    },
    {
      childCount: 0,
      text: 2,
      type: VirtualDomElements.Text,
    },
  ])
})

test('renders a gutter decoration without a line number', () => {
  const dom = GetEditorGutterVirtualDom.getEditorGutterVirtualDom([
    {
      gutterDecorations: [{ rowIndex: 0, type: 'deleted' }],
      lineNumber: 1,
      showLineNumber: false,
    },
  ])

  expect(dom).toContainEqual({
    ariaLabel: 'Deleted line 1',
    childCount: 0,
    className: 'EditorGutterDecoration EditorGutterDecorationDeleted',
    title: 'Deleted line 1',
    type: VirtualDomElements.Span,
  })
  expect(dom).toContainEqual({
    childCount: 0,
    text: '',
    type: VirtualDomElements.Text,
  })
})
