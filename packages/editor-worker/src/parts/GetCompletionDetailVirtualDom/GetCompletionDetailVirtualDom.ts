import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const getCompletionDetailVirtualDom = (content: string) => {
  const dom: any[] = [
    {
      childCount: 2,
      className: 'Viewlet EditorCompletionDetails',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.CompletionDetailContent,
      type: VirtualDomElements.Div,
    },
    text(content),
    {
      childCount: 1,
      className: ClassNames.CompletionDetailCloseButton,
      onClick: DomEventListenerFunctions.HandleClose,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: `${ClassNames.MaskIcon} ${ClassNames.IconClose}`,
      type: VirtualDomElements.Div,
    },
  ]
  return dom
}
