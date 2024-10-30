import * as EditorStrings from '../EditorStrings/EditorStrings.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const getEmptySourceActionsVirtualDom = () => {
  const dom: any[] = [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet EditorSourceActions',
      tabIndex: -1,
      childCount: 1,
    },
    text(EditorStrings.noCodeActionsAvailable()),
  ]
  return dom
}
