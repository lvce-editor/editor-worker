import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetFindWidgetFindVirtualDom from '../GetFindWidgetFindVirtualDom/GetFindWidgetFindVirtualDom.ts'
import * as GetFindWidgetReplaceVirtualDom from '../GetFindWidgetReplaceVirtualDom/GetFindWidgetReplaceVirtualDom.ts'
import * as GetSearchToggleButtonVirtualDom from '../GetSearchToggleButtonVirtualDom/GetSearchToggleButtonVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getFindWidgetVirtualDom = (
  matchCountText: string,
  replaceExpanded: boolean,
  findButtons: any,
  replaceButtons: any,
  matchCase: any,
  matchWholeWord: any,
  useRegularExpression: any
) => {
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: 'Viewlet ViewletFind ViewletFindWidget FindWidget',
    childCount: 2,
    role: AriaRoles.Group,
  })
  dom.push(...GetSearchToggleButtonVirtualDom.getSearchToggleButtonVirtualDom(replaceExpanded, 'handleClickToggleReplace'))
  dom.push({
    type: VirtualDomElements.Div,
    className: ClassNames.FindWidgetRight,
    childCount: replaceExpanded ? 2 : 1,
  })
  dom.push(...GetFindWidgetFindVirtualDom.getFindWidgetFindVirtualDom(matchCountText, findButtons))
  if (replaceExpanded) {
    dom.push(...GetFindWidgetReplaceVirtualDom.getFindWidgetReplaceVirtualDom(replaceExpanded, replaceButtons))
  }
  return dom
}