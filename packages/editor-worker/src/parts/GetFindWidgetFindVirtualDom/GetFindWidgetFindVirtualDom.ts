import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as FindStrings from '../FindStrings/FindStrings.ts'
import * as GetIconButtonVirtualDom from '../GetIconButtonVirtualDom/GetIconButtonVirtualDom.ts'
import * as GetSearchFieldVirtualDom from '../GetSearchFieldVirtualDom/GetSearchFieldVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const getFindWidgetFindVirtualDom = (matchCountText: string, buttons: any) => {
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: ClassNames.FindWidgetFind,
    childCount: 5,
  })
  dom.push(...GetSearchFieldVirtualDom.getSearchFieldVirtualDom('search-value', FindStrings.find(), 'handleInput', [], [], 'handleFocus'))
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: ClassNames.FindWidgetMatchCount,
      childCount: 1,
    },
    text(matchCountText),
    ...buttons.flatMap(GetIconButtonVirtualDom.getIconButtonVirtualDom)
  )
  return dom
}
