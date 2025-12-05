import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getIconVirtualDom = (icon: string, type = VirtualDomElements.Div) => {
  return {
    childCount: 0,
    className: `MaskIcon MaskIcon${icon}`,
    role: AriaRoles.None,
    type,
  }
}
