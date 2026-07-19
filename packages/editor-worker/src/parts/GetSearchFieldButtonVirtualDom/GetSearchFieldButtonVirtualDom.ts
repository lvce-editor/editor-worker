import type { ISearchFieldButton } from '../ISearchFieldButton/ISearchFieldButton.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as TabIndex from '../TabIndex/TabIndex.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getSearchFieldButtonVirtualDom = (button: ISearchFieldButton) => {
  const { checked, icon, title } = button
  return [
    {
      ariaChecked: checked,
      childCount: 1,
      className: MergeClassNames.mergeClassNames(ClassNames.SearchFieldButton, checked ? ClassNames.SearchFieldButtonChecked : ''),
      role: AriaRoles.Checkbox,
      tabIndex: TabIndex.Focusable,
      title,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: MergeClassNames.mergeClassNames(ClassNames.MaskIcon, icon),
      type: VirtualDomElements.Div,
    },
  ]
}
