import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as TabIndex from '../TabIndex/TabIndex.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const completionDetailNode: VirtualDomNode = {
  childCount: 2,
  className: MergeClassNames.mergeClassNames('Viewlet', 'EditorCompletionDetails'),
  type: VirtualDomElements.Div,
}

const completionDetailContentNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.CompletionDetailContent,
  type: VirtualDomElements.Div,
}

const completionDetailCloseButtonNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.CompletionDetailCloseButton,
  onClick: DomEventListenerFunctions.HandleClose,
  role: AriaRoles.Button,
  tabIndex: TabIndex.Focusable,
  type: VirtualDomElements.Div,
}

const completionDetailCloseIconNode: VirtualDomNode = {
  childCount: 0,
  className: MergeClassNames.mergeClassNames(ClassNames.MaskIcon, ClassNames.IconClose),
  type: VirtualDomElements.Div,
}

export const getCompletionDetailVirtualDom = (content: string) => {
  const dom: any[] = [
    completionDetailNode,
    completionDetailContentNode,
    text(content),
    completionDetailCloseButtonNode,
    completionDetailCloseIconNode,
  ]
  return dom
}
