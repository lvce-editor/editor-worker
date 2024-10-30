import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const getEditorMessageVirtualDom = (message: string) => {
  const dom: any[] = [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet EditorMessage',
      tabIndex: -1,
      childCount: 1,
    },
    text(message),
  ]
  return dom
}
