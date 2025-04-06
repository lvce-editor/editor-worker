import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const getLineInfoVirtualDom = (lineInfo: readonly string[]): readonly VirtualDomNode[] => {
  const dom: VirtualDomNode[] = [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.HoverEditorRow,
      childCount: lineInfo.length / 2,
    },
  ]
  for (let i = 0; i < lineInfo.length; i += 2) {
    const tokenText = lineInfo[i]
    const tokenClass = lineInfo[i + 1]
    dom.push(
      {
        type: VirtualDomElements.Span,
        className: tokenClass,
        childCount: 1,
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
