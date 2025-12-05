import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const getGutterInfoVirtualDom = (gutterInfo: any) => {
  return [
    {
      childCount: 1,
      className: 'LineNumber',
      type: VirtualDomElements.Span,
    },
    text(gutterInfo),
  ]
}

export const getEditorGutterVirtualDom = (gutterInfos: any[]) => {
  const dom = gutterInfos.flatMap(getGutterInfoVirtualDom)
  return dom
}
