import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getIconDom = (fileIcon: string, symbolName: string) => {
  if (fileIcon) {
    return GetFileIconVirtualDom.getFileIconVirtualDom(fileIcon)
  }
  return {
    childCount: 0,
    className: `${ClassNames.ColoredMaskIcon} ${symbolName}`,
    type: VirtualDomElements.Div,
  }
}
