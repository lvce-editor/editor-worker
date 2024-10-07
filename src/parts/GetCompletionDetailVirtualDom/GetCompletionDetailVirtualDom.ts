import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const getCompletionDetailVirtualDom = (content: string) => {
  const dom: any[] = [
    {
      type: VirtualDomElements.Div,
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.CompletionDetailContent,
      childCount: 1,
    },
    text(content),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.CompletionDetailCloseButton,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.MaskIcon} ${ClassNames.IconClose}`,
      childCount: 0,
    },
  ]
  return dom
}
