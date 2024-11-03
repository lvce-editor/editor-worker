import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as EditorStrings from '../EditorStrings/EditorStrings.ts'
import * as GetEmptySourceActionsVirtualDom from '../GetEmptySourceActionsVirtualDom/GetEmptySourceActionsVirtualDom.ts'
import * as GetSourceActionListItemVirtualDom from '../GetSourceActionListItemVirtualDom/GetSourceActionListItemVirtualDom.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const getSourceActionsVirtualDom = (sourceActions: any[]) => {
  if (sourceActions.length === 0) {
    return GetEmptySourceActionsVirtualDom.getEmptySourceActionsVirtualDom()
  }
  const dom: any[] = [
    {
      type: VirtualDomElements.Div,
      className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.EditorSourceActions),
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
      className: ClassNames.EditorSourceActionsList,
      childCount: sourceActions.length,
      onClick: DomEventListenerFunctions.HandleClick,
    },
    ...sourceActions.flatMap(GetSourceActionListItemVirtualDom.getSourceActionListItemVirtualDom),
  ]
  return dom
}
