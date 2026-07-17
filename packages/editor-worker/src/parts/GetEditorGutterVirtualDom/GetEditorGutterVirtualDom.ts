import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const getGutterInfoVirtualDom = (gutterInfo: any) => {
  const isBreakpoint = typeof gutterInfo === 'object' && gutterInfo.isBreakpoint
  const lineNumber = typeof gutterInfo === 'object' ? gutterInfo.lineNumber : gutterInfo
  const label = `Breakpoint on line ${lineNumber}`
  return [
    {
      ...(isBreakpoint && {
        ariaLabel: label,
        style: 'color:var(--DebugIconBreakpointForeground,#e51400)',
        title: label,
      }),
      childCount: 1,
      className: isBreakpoint ? 'LineNumber LineNumberBreakpoint' : 'LineNumber',
      type: VirtualDomElements.Span,
    },
    text(isBreakpoint ? '●' : lineNumber),
  ]
}

export const getEditorGutterVirtualDom = (gutterInfos: readonly any[]) => {
  const dom = gutterInfos.flatMap(getGutterInfoVirtualDom)
  return dom
}
