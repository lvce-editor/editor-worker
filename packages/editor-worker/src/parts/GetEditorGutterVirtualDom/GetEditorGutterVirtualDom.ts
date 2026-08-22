import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const getGutterInfoVirtualDom = (gutterInfo: any, activeLineNumber: number) => {
  const isBreakpoint = typeof gutterInfo === 'object' && gutterInfo.isBreakpoint
  const isLightBulb = typeof gutterInfo === 'object' && gutterInfo.isLightBulb
  const lineNumber = typeof gutterInfo === 'object' ? gutterInfo.lineNumber : gutterInfo
  const label = isLightBulb ? `Show Code Actions on line ${lineNumber}` : `Breakpoint on line ${lineNumber}`
  let className = lineNumber === activeLineNumber ? 'LineNumber LineNumberActive' : 'LineNumber'
  if (isLightBulb) {
    className += ' LineNumberLightBulb MaskIconLightBulb'
  } else if (isBreakpoint) {
    className += ' LineNumberBreakpoint'
  }
  return [
    {
      ...((isBreakpoint || isLightBulb) && { ariaLabel: label, title: label }),
      ...(isBreakpoint && !isLightBulb && { style: 'color:var(--DebugIconBreakpointForeground,#e51400)' }),
      childCount: 1,
      className,
      ...(isLightBulb && { onClick: DomEventListenerFunctions.HandleLightBulbClick, role: AriaRoles.Button }),
      type: VirtualDomElements.Span,
    },
    text(isLightBulb ? '' : isBreakpoint ? '●' : lineNumber),
  ]
}

export const getEditorGutterVirtualDom = (gutterInfos: readonly any[], activeLineNumber = -1) => {
  const dom = gutterInfos.flatMap((gutterInfo) => getGutterInfoVirtualDom(gutterInfo, activeLineNumber))
  return dom
}
