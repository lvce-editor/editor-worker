import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getSearchToggleButtonVirtualDom = (replaceExpanded: boolean, onClick = '') => {
  return [
    {
      type: VirtualDomElements.Button,
      className: `IconButton SearchToggleButton ${replaceExpanded ? 'SearchToggleButtonExpanded' : ''}`,
      title: 'Toggle Replace',
      ariaLabel: 'Toggle Replace',
      ariaExpanded: replaceExpanded,
      name: 'ToggleReplace',
      childCount: 1,
      'data-command': 'toggleReplace',
      onClick,
      onFocus: 'handleToggleReplaceFocus',
    },
    {
      type: VirtualDomElements.Div,
      className: `MaskIcon ${replaceExpanded ? 'MaskIconChevronDown' : 'MaskIconChevronRight'}`,
      childCount: 0,
    },
  ]
}
