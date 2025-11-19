import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetLineInfosVirtualDom from '../GetLineInfosVirtualDom/GetLineInfosVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const hoverProblemMessage: VirtualDomNode = {
  type: VirtualDomElements.Span,
  className: ClassNames.HoverProblemMessage,
  childCount: 1,
}

const hoverProblemDetail: VirtualDomNode = {
  type: VirtualDomElements.Span,
  className: ClassNames.HoverProblemDetail,
  childCount: 1,
}

const getChildCount = (lineInfos: any, documentation: any, diagnostics: any): number => {
  return lineInfos.length + documentation ? 1 : 0 + (diagnostics && diagnostics.length > 0) ? 1 : 0
}

export const getHoverVirtualDom = (lineInfos: any, documentation: any, diagnostics: any): readonly VirtualDomNode[] => {
  const dom: VirtualDomNode[] = []
  dom.push({
    type: VirtualDomElements.Div,
    className: 'Viewlet EditorHover',
    childCount: getChildCount(lineInfos, documentation, diagnostics) + 1,
  })
  if (diagnostics && diagnostics.length > 0) {
    dom.push({
      type: VirtualDomElements.Div,
      className: `${ClassNames.HoverDisplayString} ${ClassNames.HoverProblem}`,
      childCount: diagnostics.length * 2,
    })
    for (const diagnostic of diagnostics) {
      dom.push(hoverProblemMessage, text(diagnostic.message), hoverProblemDetail, text(`${diagnostic.source} (${diagnostic.code})`))
    }
  }

  if (lineInfos.length > 0) {
    const lineInfosDom = GetLineInfosVirtualDom.getLineInfosVirtualDom(lineInfos)
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: ClassNames.HoverDisplayString,
        childCount: lineInfos.length,
      },
      ...lineInfosDom,
    )
  }

  if (documentation) {
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: ClassNames.HoverDocumentation,
        childCount: 1,
      },
      text(documentation),
    )
  }

  dom.push({
    type: VirtualDomElements.Div,
    className: 'Sash SashVertical SashResize',
    childCount: 0,
    onPointerDown: DomEventListenerFunctions.HandleSashPointerDown,
  })

  return dom
}
