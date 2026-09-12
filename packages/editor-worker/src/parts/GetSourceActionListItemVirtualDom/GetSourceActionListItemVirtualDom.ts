import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const focusedActionClassName = MergeClassNames.mergeClassNames(ClassNames.SourceActionItem, ClassNames.SourceActionItemFocused)
const sourceActionIconClassName = MergeClassNames.mergeClassNames(ClassNames.SourceActionIcon, ClassNames.MaskIcon, ClassNames.MaskIconSymbolFile)

const getActionClassName = (isFocused: boolean) => {
  if (isFocused) {
    return focusedActionClassName
  }
  return ClassNames.SourceActionItem
}

export const getSourceActionListItemVirtualDom = (sourceAction: any) => {
  const { isFocused, name } = sourceAction
  const actionClassName = getActionClassName(isFocused)
  return [
    {
      childCount: 2,
      className: actionClassName,
      type: VirtualDomElements.Div,
    },
    {
      className: sourceActionIconClassName,
      type: VirtualDomElements.Div,
    },
    text(name),
  ]
}
