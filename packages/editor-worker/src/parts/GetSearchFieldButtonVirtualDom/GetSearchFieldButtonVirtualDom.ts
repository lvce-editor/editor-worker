import type { ISearchFieldButton } from '../ISearchFieldButton/ISearchFieldButton.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getSearchFieldButtonVirtualDom = (button: ISearchFieldButton) => {
  const { icon, checked, title } = button
  return [
    {
      type: VirtualDomElements.Div,
      className: MergeClassNames.mergeClassNames(ClassNames.SearchFieldButton, checked ? ClassNames.SearchFieldButtonChecked : ''),
      title,
      role: AriaRoles.CheckBox,
      ariaChecked: checked,
      tabIndex: 0,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: MergeClassNames.mergeClassNames(ClassNames.MaskIcon, icon),
      childCount: 0,
    },
  ]
}
