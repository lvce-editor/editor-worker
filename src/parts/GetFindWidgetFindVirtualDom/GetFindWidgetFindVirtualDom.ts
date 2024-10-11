import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetIconVirtualDom from '../GetIconVirtualDom/GetIconVirtualDom.ts'
import * as GetSearchFieldVirtualDom from '../GetSearchFieldVirtualDom/GetSearchFieldVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const getIconButtonVirtualDom = (iconButton: any) => {
  const { label, icon, disabled } = iconButton
  let className = ClassNames.IconButton
  if (disabled) {
    className += ' ' + ClassNames.IconButtonDisabled
  }
  return [
    {
      type: VirtualDomElements.Button,
      className,
      title: label,
      ariaLabel: label,
      childCount: 1,
      disabled: disabled ? true : undefined,
    },
    GetIconVirtualDom.getIconVirtualDom(icon),
  ]
}

export const getFindWidgetFindVirtualDom = (matchCountText: string, buttons: any) => {
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: ClassNames.FindWidgetFind,
    childCount: 5,
  })
  dom.push(...GetSearchFieldVirtualDom.getSearchFieldVirtualDom('search-value', 'Find', 'handleInput', [], [], 'handleFocus'))
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: ClassNames.FindWidgetMatchCount,
      childCount: 1,
    },
    text(matchCountText),
    ...buttons.flatMap(getIconButtonVirtualDom)
  )
  return dom
}
