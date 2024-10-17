import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as EditorStrings from '../EditorStrings/EditorStrings.ts'
import * as GetSourceActionListItemVirtualDom from '../GetSourceActionListItemVirtualDom/GetSourceActionListItemVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const getSourceActionsVirtualDom = (sourceActions: any[]) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet EditorSourceActions',
      tabIndex: -1,
      childCount: 2,
      onFocusIn: DomEventListenerFunctions.HandleFocusIn,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.SourceActionHeading,
      childCount: 1,
    },
    text(EditorStrings.sourceAction()),
    {
      type: VirtualDomElements.Div,
      className: 'EditorSourceActionsList',
      childCount: sourceActions.length,
      onClick: DomEventListenerFunctions.HandleClick,
    },
    ...sourceActions.flatMap(GetSourceActionListItemVirtualDom.getSourceActionListItemVirtualDom),
  ]
  return dom
}
