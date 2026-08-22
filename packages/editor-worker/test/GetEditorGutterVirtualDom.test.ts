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
