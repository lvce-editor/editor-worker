import * as FindStrings from '../FindStrings/FindStrings.ts'
import * as Icon from '../Icon/Icon.ts'

export const getFindWidgetButtons = (buttonsEnabled: boolean) => {
  const findButtons = [
    {
      label: FindStrings.previousMatch(),
      icon: Icon.ArrowUp,
      disabled: !buttonsEnabled,
      onClick: 'handleClickPreviousMatch',
      name: 'FocusPrevious',
    },
    {
      label: FindStrings.nextMatch(),
      icon: Icon.ArrowDown,
      disabled: !buttonsEnabled,
      onClick: 'handleClickNextMatch',
      name: 'FocusNext',
    },
    {
      label: FindStrings.close(),
      icon: Icon.Close,
      disabled: false,
      onClick: 'handleClickClose',
      name: 'Close',
    },
  ]
  const replaceButtons = [
    {
      label: FindStrings.replace(),
      icon: Icon.Replace,
      disabled: !buttonsEnabled,
      onClick: 'handleClickReplace',
      name: 'Replace',
    },
    {
      label: FindStrings.replaceAll(),
      icon: Icon.ReplaceAll,
      disabled: !buttonsEnabled,
      onClick: 'handleClickReplaceAll',
      name: 'ReplaceAll',
    },
  ]
  return {
    findButtons,
    replaceButtons,
  }
}
