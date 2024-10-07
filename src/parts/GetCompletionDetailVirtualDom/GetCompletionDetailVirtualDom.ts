import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const getCompletionDetailVirtualDom = (content: string) => {
  const dom: any[] = [
    {
      type: VirtualDomElements.Div,
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'CompletionDetailContent',
      childCount: 1,
    },
    text(content),
    {
      type: VirtualDomElements.Div,
      className: 'CompletionDetailCloseButton',
      childCount: 0,
    },
  ]
  return dom
}
