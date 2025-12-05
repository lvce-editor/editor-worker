import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetIconVirtualDom from '../GetIconVirtualDom/GetIconVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getIconButtonVirtualDom = (iconButton: any) => {
  const { disabled, icon, label, name, onClick } = iconButton
  let className = ClassNames.IconButton
  if (disabled) {
    className += ' ' + ClassNames.IconButtonDisabled
  }
  return [
    {
      ariaLabel: label,
      childCount: 1,
      className,
      disabled: disabled ? true : undefined,
      name: name,
      onClick: onClick,
      title: label,
      type: VirtualDomElements.Button,
    },
    GetIconVirtualDom.getIconVirtualDom(icon),
  ]
}
