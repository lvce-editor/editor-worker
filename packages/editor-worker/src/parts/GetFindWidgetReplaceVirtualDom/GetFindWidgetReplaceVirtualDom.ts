import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as FindStrings from '../FindStrings/FindStrings.ts'
import * as GetIconButtonVirtualDom from '../GetIconButtonVirtualDom/GetIconButtonVirtualDom.ts'
import * as GetSearchFieldVirtualDom from '../GetSearchFieldVirtualDom/GetSearchFieldVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getFindWidgetReplaceVirtualDom = (replaceExpanded: boolean, replaceButtons: any) => {
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
        'handleReplaceInput',
        [],
        [],
        'handleReplaceFocus'
      ),
      ...replaceButtons.flatMap(GetIconButtonVirtualDom.getIconButtonVirtualDom)
    )
  }
  return dom
}
