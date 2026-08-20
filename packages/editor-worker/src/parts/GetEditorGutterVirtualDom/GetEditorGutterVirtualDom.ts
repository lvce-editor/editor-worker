import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const getGutterInfoVirtualDom = (gutterInfo: any) => {
  const isBreakpoint = typeof gutterInfo === 'object' && gutterInfo.isBreakpoint
  const isLightBulb = typeof gutterInfo === 'object' && gutterInfo.isLightBulb
  const lineNumber = typeof gutterInfo === 'object' ? gutterInfo.lineNumber : gutterInfo
  const label = isLightBulb ? `Show Code Actions on line ${lineNumber}` : `Breakpoint on line ${lineNumber}`
  return [
    {
      ...((isBreakpoint || isLightBulb) && { ariaLabel: label, title: label }),
      ...(isBreakpoint && !isLightBulb && { style: 'color:var(--DebugIconBreakpointForeground,#e51400)' }),
      childCount: 1,
      className: isLightBulb ? 'LineNumber LineNumberLightBulb MaskIconLightBulb' : isBreakpoint ? 'LineNumber LineNumberBreakpoint' : 'LineNumber',
      ...(isLightBulb && { onClick: DomEventListenerFunctions.HandleLightBulbClick, role: AriaRoles.Button }),
      type: VirtualDomElements.Span,
    },
    text(isLightBulb ? '' : isBreakpoint ? '●' : lineNumber),
  ]
}

export const getEditorGutterVirtualDom = (gutterInfos: readonly any[]) => {
  const dom = gutterInfos.flatMap(getGutterInfoVirtualDom)
  return dom
}
