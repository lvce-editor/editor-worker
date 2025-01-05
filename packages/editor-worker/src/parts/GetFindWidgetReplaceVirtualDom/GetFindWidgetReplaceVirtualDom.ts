import type { FindWidgetButton } from '../FindWidgetButton/FindWidgetButton.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as FindStrings from '../FindStrings/FindStrings.ts'
import * as GetIconButtonVirtualDom from '../GetIconButtonVirtualDom/GetIconButtonVirtualDom.ts'
import * as GetSearchFieldVirtualDom from '../GetSearchFieldVirtualDom/GetSearchFieldVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getFindWidgetReplaceVirtualDom = (replaceExpanded: boolean, replaceButtons: readonly FindWidgetButton[]) => {
  const dom = []
  if (replaceExpanded) {
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: ClassNames.FindWidgetReplace,
        childCount: 1 + replaceButtons.length,
      },
      ...GetSearchFieldVirtualDom.getSearchFieldVirtualDom(
        'replace-value',
        FindStrings.replace(),
        DomEventListenerFunctions.HandleReplaceInput,
        [],
        [],
        DomEventListenerFunctions.HandleReplaceFocus,
      ),
      ...replaceButtons.flatMap(GetIconButtonVirtualDom.getIconButtonVirtualDom),
    )
  }
  return dom
}
