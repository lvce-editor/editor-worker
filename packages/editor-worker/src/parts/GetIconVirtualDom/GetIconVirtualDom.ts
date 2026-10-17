import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getIconVirtualDom = (icon: string, type = VirtualDomElements.Div) => {
  return {
    childCount: 0,
    className: MergeClassNames.mergeClassNames('MaskIcon', `MaskIcon${icon}`),
    role: AriaRoles.None,
    type,
  }
}
