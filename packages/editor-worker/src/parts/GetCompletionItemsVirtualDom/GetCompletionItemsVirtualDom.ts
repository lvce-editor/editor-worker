import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as EditorStrings from '../EditorStrings/EditorStrings.ts'
import * as GetCompletionItemVirtualDom from '../GetCompletionItemVirtualDom/GetCompletionItemVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const noCompletionResultsNode: VirtualDomNode = {
  childCount: 1,
  type: VirtualDomElements.Div,
}

export const getCompletionItemsVirtualDom = (visibleItems: any[]): readonly VirtualDomNode[] => {
  if (visibleItems.length === 0) {
    return [noCompletionResultsNode, text(EditorStrings.noResults())]
  }
  const root = {
    childCount: visibleItems.length,
    type: VirtualDomElements.Div,
  }
  const dom = [root, ...visibleItems.flatMap(GetCompletionItemVirtualDom.getCompletionItemVirtualDom)]
  return dom
}
