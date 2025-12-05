import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetLineInfosVirtualDom from '../GetLineInfosVirtualDom/GetLineInfosVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const hoverProblemMessage: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.HoverProblemMessage,
  type: VirtualDomElements.Span,
}

const hoverProblemDetail: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.HoverProblemDetail,
  type: VirtualDomElements.Span,
}

const getChildCount = (lineInfos: any, documentation: any, diagnostics: any): number => {
  return lineInfos.length + documentation ? 1 : 0 + (diagnostics && diagnostics.length > 0) ? 1 : 0
}

export const getHoverVirtualDom = (lineInfos: any, documentation: any, diagnostics: any): readonly VirtualDomNode[] => {
  const dom: VirtualDomNode[] = []
  dom.push({
    childCount: getChildCount(lineInfos, documentation, diagnostics) + 1,
    className: 'Viewlet EditorHover',
    type: VirtualDomElements.Div,
  })
  if (diagnostics && diagnostics.length > 0) {
    dom.push({
      childCount: diagnostics.length * 2,
      className: `${ClassNames.HoverDisplayString} ${ClassNames.HoverProblem}`,
      type: VirtualDomElements.Div,
    })
    for (const diagnostic of diagnostics) {
      dom.push(hoverProblemMessage, text(diagnostic.message), hoverProblemDetail, text(`${diagnostic.source} (${diagnostic.code})`))
    }
  }

  if (lineInfos.length > 0) {
    const lineInfosDom = GetLineInfosVirtualDom.getLineInfosVirtualDom(lineInfos)
    dom.push(
      {
        childCount: lineInfos.length,
        className: ClassNames.HoverDisplayString,
        type: VirtualDomElements.Div,
      },
      ...lineInfosDom,
    )
  }

  if (documentation) {
    dom.push(
      {
        childCount: 1,
        className: ClassNames.HoverDocumentation,
        type: VirtualDomElements.Div,
      },
      text(documentation),
    )
  }

  dom.push({
    childCount: 0,
    className: 'Sash SashVertical SashResize',
    onPointerDown: DomEventListenerFunctions.HandleSashPointerDown,
    type: VirtualDomElements.Div,
  })

  return dom
}
