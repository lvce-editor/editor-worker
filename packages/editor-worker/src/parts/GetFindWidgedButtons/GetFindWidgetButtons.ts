import type { FindWidgetButton } from '../FindWidgetButton/FindWidgetButton.ts'
import type { FindWidgetButtons } from '../FindWidgetButtons/FindWidgetButtons.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as FindStrings from '../FindStrings/FindStrings.ts'
import * as Icon from '../Icon/Icon.ts'
import * as Names from '../Names/Names.ts'

export const getFindWidgetButtons = (findButtonsEnabled: boolean, replaceButtonsEnabled: boolean): FindWidgetButtons => {
  const findButtons: readonly FindWidgetButton[] = [
    {
      label: FindStrings.previousMatch(),
      icon: Icon.ArrowUp,
      disabled: !findButtonsEnabled,
      onClick: DomEventListenerFunctions.HandleClickPreviousMatch,
      name: Names.FocusPrevious,
    },
    {
      label: FindStrings.nextMatch(),
      icon: Icon.ArrowDown,
      disabled: !findButtonsEnabled,
      onClick: DomEventListenerFunctions.HandleClickNextMatch,
      name: Names.FocusNext,
    },
    {
      label: FindStrings.close(),
      icon: Icon.Close,
      disabled: false,
      onClick: DomEventListenerFunctions.HandleClickClose,
      name: Names.Close,
    },
  ]
  const replaceButtons: readonly FindWidgetButton[] = [
    {
      label: FindStrings.replace(),
      icon: Icon.Replace,
      disabled: !replaceButtonsEnabled,
      onClick: DomEventListenerFunctions.HandleClickReplace,
      name: Names.Replace,
    },
    {
      label: FindStrings.replaceAll(),
      icon: Icon.ReplaceAll,
      disabled: !replaceButtonsEnabled,
      onClick: DomEventListenerFunctions.HandleClickReplaceAll,
      name: Names.ReplaceAll,
    },
  ]
  return {
    findButtons,
    replaceButtons,
  }
}
