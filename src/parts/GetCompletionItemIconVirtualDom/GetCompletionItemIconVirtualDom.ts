import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getIconDom = (fileIcon: any, symbolName: string) => {
  if (fileIcon) {
    return GetFileIconVirtualDom.getFileIconVirtualDom(fileIcon)
  }
  return {
    type: VirtualDomElements.Div,
    className: `${ClassNames.ColoredMaskIcon} ${symbolName}`,
    childCount: 0,
  }
}
