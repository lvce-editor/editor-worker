import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetDiagnosticHoverDetail from '../GetDiagnosticHoverDetail/GetDiagnosticHoverDetail.ts'
import * as GetLineInfosVirtualDom from '../GetLineInfosVirtualDom/GetLineInfosVirtualDom.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as TabIndex from '../TabIndex/TabIndex.ts'
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

const hoverDocumentationNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.HoverDocumentation,
  type: VirtualDomElements.Div,
}

const hoverSashNode: VirtualDomNode = {
  childCount: 0,
  className: MergeClassNames.mergeClassNames('Sash', 'SashVertical', 'SashResize'),
  onPointerDown: DomEventListenerFunctions.HandleSashPointerDown,
  type: VirtualDomElements.Div,
}

const getChildCount = (lineInfos: any, documentationVirtualDom: readonly VirtualDomNode[], diagnostics: any): number => {
  const documentationCount = documentationVirtualDom.length > 0 ? 1 : 0
  const diagnosticsCount = diagnostics && diagnostics.length > 0 ? 1 : 0
  return (lineInfos.length > 0 ? 1 : 0) + documentationCount + diagnosticsCount
}

const getEditorHoverClassName = (lineInfos: any, documentationVirtualDom: readonly VirtualDomNode[], diagnostics: any): string => {
  const isDiagnosticOnly = diagnostics?.length === 1 && lineInfos.length === 0 && documentationVirtualDom.length === 0
  return MergeClassNames.mergeClassNames('Viewlet', 'EditorHover', isDiagnosticOnly ? ClassNames.EditorHoverDiagnosticOnly : '')
}

export const getHoverVirtualDom = (
  lineInfos: any,
  documentationVirtualDom: readonly VirtualDomNode[],
  diagnostics: any,
  editorUid = 0,
): readonly VirtualDomNode[] => {
  const dom: VirtualDomNode[] = []
  dom.push({
    childCount: getChildCount(lineInfos, documentationVirtualDom, diagnostics) + 1,
    className: getEditorHoverClassName(lineInfos, documentationVirtualDom, diagnostics),
    'data-uid': editorUid,
    onMouseDown: DomEventListenerFunctions.HandleHoverMouseDown,
    onMouseOut: DomEventListenerFunctions.HandleMouseOut,
    onMouseOver: DomEventListenerFunctions.HandleMouseOver,
    tabIndex: TabIndex.Focusable,
    type: VirtualDomElements.Div,
  })
  if (diagnostics && diagnostics.length > 0) {
    dom.push({
      childCount: diagnostics.length * 2,
      className: ClassNames.HoverProblem,
      type: VirtualDomElements.Div,
    })
    for (const diagnostic of diagnostics) {
      dom.push(hoverProblemMessage, text(diagnostic.message), hoverProblemDetail, text(GetDiagnosticHoverDetail.getDiagnosticHoverDetail(diagnostic)))
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

  if (documentationVirtualDom.length > 0) {
    dom.push(hoverDocumentationNode, ...documentationVirtualDom)
  }

  dom.push(hoverSashNode)

  return dom
}
