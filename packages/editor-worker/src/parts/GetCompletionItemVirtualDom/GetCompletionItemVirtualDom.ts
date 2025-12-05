import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetCompletionItemIconVirtualDom from '../GetCompletionItemIconVirtualDom/GetCompletionItemIconVirtualDom.ts'
import * as GetHighlightedLabelDom from '../GetHighlightedLabelDom/GetHighlightedLabelDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getCompletionItemVirtualDom = (visibleItem: any): readonly VirtualDomNode[] => {
  const { deprecated, fileIcon, focused, highlights, label, symbolName, top } = visibleItem
  let className = ClassNames.EditorCompletionItem
  if (focused) {
    className += ' ' + ClassNames.EditorCompletionItemFocused
  }
  if (deprecated) {
    className += ' ' + ClassNames.EditorCompletionItemDeprecated
  }
  return [
    {
      childCount: 2,
      className,
      role: AriaRoles.Option,
      top,
      type: VirtualDomElements.Div,
    },
    GetCompletionItemIconVirtualDom.getIconDom(fileIcon, symbolName),
    ...GetHighlightedLabelDom.getHighlightedLabelDom(label, highlights),
  ]
}
