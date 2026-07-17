import { expect, test } from '@jest/globals'
import * as GetEditorGutterVirtualDom from '../src/parts/GetEditorGutterVirtualDom/GetEditorGutterVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

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
