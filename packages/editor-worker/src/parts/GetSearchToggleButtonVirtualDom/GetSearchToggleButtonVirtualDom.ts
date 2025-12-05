import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as InputName from '../InputName/InputName.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getSearchToggleButtonVirtualDom = (replaceExpanded: boolean, onClick = ''): readonly VirtualDomNode[] => {
  return [
    {
      ariaExpanded: replaceExpanded,
      ariaLabel: 'Toggle Replace',
      childCount: 1,
      className: `IconButton SearchToggleButton ${replaceExpanded ? 'SearchToggleButtonExpanded' : ''}`,
      'data-command': 'toggleReplace',
      name: InputName.ToggleReplace,
      onClick,
      onFocus: 'handleToggleReplaceFocus',
      title: 'Toggle Replace',
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: `MaskIcon ${replaceExpanded ? 'MaskIconChevronDown' : 'MaskIconChevronRight'}`,
      type: VirtualDomElements.Div,
    },
  ]
}
