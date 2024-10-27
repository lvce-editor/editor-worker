import * as FindStrings from '../FindStrings/FindStrings.ts'
import * as Icon from '../Icon/Icon.ts'
import * as Names from '../Names/Names.ts'

export const getFindWidgetButtons = (buttonsEnabled: boolean) => {
  const findButtons = [
    {
      label: FindStrings.previousMatch(),
      icon: Icon.ArrowUp,
      disabled: !buttonsEnabled,
      onClick: 'handleClickPreviousMatch',
      name: Names.FocusPrevious,
    },
    {
      label: FindStrings.nextMatch(),
      icon: Icon.ArrowDown,
      disabled: !buttonsEnabled,
      onClick: 'handleClickNextMatch',
      name: Names.FocusNext,
    },
    {
      label: FindStrings.close(),
      icon: Icon.Close,
      disabled: false,
      onClick: 'handleClickClose',
      name: Names.Close,
    },
  ]
  const replaceButtons = [
    {
      label: FindStrings.replace(),
      icon: Icon.Replace,
      disabled: !buttonsEnabled,
      onClick: 'handleClickReplace',
      name: Names.Replace,
    },
    {
      label: FindStrings.replaceAll(),
      icon: Icon.ReplaceAll,
      disabled: !buttonsEnabled,
      onClick: 'handleClickReplaceAll',
      name: Names.ReplaceAll,
    },
  ]
  return {
    findButtons,
    replaceButtons,
  }
}
