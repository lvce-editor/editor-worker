import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const getLineInfoVirtualDom = (lineInfo: readonly string[]): readonly VirtualDomNode[] => {
  const dom: VirtualDomNode[] = [
    {
      childCount: lineInfo.length / 2,
      className: ClassNames.HoverEditorRow,
      type: VirtualDomElements.Div,
    },
  ]
  for (let i = 0; i < lineInfo.length; i += 2) {
    const tokenText = lineInfo[i]
    const tokenClass = lineInfo[i + 1]
    dom.push(
      {
        childCount: 1,
        className: tokenClass,
        type: VirtualDomElements.Span,
      },
      text(tokenText),
    )
  }
  return dom
}

export const getLineInfosVirtualDom = (lineInfos: readonly (readonly string[])[]): readonly VirtualDomNode[] => {
  const dom = lineInfos.flatMap(getLineInfoVirtualDom)
  return dom
}
