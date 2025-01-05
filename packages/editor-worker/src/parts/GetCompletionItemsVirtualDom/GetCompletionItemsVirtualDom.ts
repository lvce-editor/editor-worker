import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as EditorStrings from '../EditorStrings/EditorStrings.ts'
import * as GetCompletionItemVirtualDom from '../GetCompletionItemVirtualDom/GetCompletionItemVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const getCompletionItemsVirtualDom = (visibleItems: any[]): readonly VirtualDomNode[] => {
  if (visibleItems.length === 0) {
    return [
      {
        type: VirtualDomElements.Div,
        childCount: 1,
      },
      text(EditorStrings.noResults()),
    ]
  }
  const root = {
    type: VirtualDomElements.Div,
    childCount: visibleItems.length,
  }
  const dom = [root, ...visibleItems.flatMap(GetCompletionItemVirtualDom.getCompletionItemVirtualDom)]
  return dom
}
