import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const getSourceActionListItemVirtualDom = (sourceAction: any) => {
  const { isFocused, name } = sourceAction
  const actionClassName = isFocused ? ClassNames.SourceActionItemFocused : ClassNames.SourceActionItem
  return [
    {
      childCount: 2,
      className: actionClassName,
      type: VirtualDomElements.Div,
    },
    {
      className: ClassNames.SourceActionIcon,
      type: VirtualDomElements.Div,
    },
    text(name),
  ]
}
