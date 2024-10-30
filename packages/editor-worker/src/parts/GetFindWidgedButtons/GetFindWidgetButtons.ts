import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as FindStrings from '../FindStrings/FindStrings.ts'
import type { FindWidgetButton } from '../FindWidgetButton/FindWidgetButton.ts'
import * as Icon from '../Icon/Icon.ts'
import * as Names from '../Names/Names.ts'

export const getFindWidgetButtons = (
  buttonsEnabled: boolean
): {
  readonly findButtons: readonly FindWidgetButton[]
  readonly replaceButtons: readonly FindWidgetButton[]
} => {
  const findButtons: readonly FindWidgetButton[] = [
    {
      label: FindStrings.previousMatch(),
      icon: Icon.ArrowUp,
      disabled: !buttonsEnabled,
      onClick: DomEventListenerFunctions.HandleClickPreviousMatch,
      name: Names.FocusPrevious,
    },
    {
      label: FindStrings.nextMatch(),
      icon: Icon.ArrowDown,
      disabled: !buttonsEnabled,
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
  const replaceButtons = [
    {
      label: FindStrings.replace(),
      icon: Icon.Replace,
      disabled: !buttonsEnabled,
      onClick: DomEventListenerFunctions.HandleClickReplace,
      name: Names.Replace,
    },
    {
      label: FindStrings.replaceAll(),
      icon: Icon.ReplaceAll,
      disabled: !buttonsEnabled,
      onClick: DomEventListenerFunctions.HandleClickReplaceAll,
      name: Names.ReplaceAll,
    },
  ]
  return {
    findButtons,
    replaceButtons,
  }
}
