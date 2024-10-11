import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as EditorStrings from '../EditorStrings/EditorStrings.ts'
import * as GetSearchFieldVirtualDom from '../GetSearchFieldVirtualDom/GetSearchFieldVirtualDom.ts'
import * as FindStrings from '../FindStrings/FindStrings.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const getFindWidgetReplaceVirtualDom = (replaceExpanded: boolean) => {
  const dom = []
  if (replaceExpanded) {
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: ClassNames.FindWidgetReplace,
        childCount: 2,
      },
      dom.push(
        ...GetSearchFieldVirtualDom.getSearchFieldVirtualDom(
          'replace-value',
          FindStrings.replace(),
          'handleReplaceInput',
          [],
          [],
          'handleReplaceFocus'
        )
      ),
      text(EditorStrings.replace())
    )
  }
  return dom
}
