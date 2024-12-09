export const renderEventListeners = (): readonly any[] => {
  return [
    {
      name: 'handleInput',
      params: ['FindWidget.handleInput', 'event.target.value'],
    },
    {
      name: 'handleClickClose',
      params: ['FindWidget.close'],
    },
    {
      name: 'handleClickPreviousMatch',
      params: ['FindWidget.focusPrevious'],
    },
    {
      name: 'handleClickNextMatch',
      params: ['FindWidget.focusNext'],
    },
    {
      name: 'handleClickReplace',
      params: ['FindWidget.replace'],
    },
    {
      name: 'handleClickReplaceAll',
      params: ['FindWidget.replaceAll'],
    },
    {
      name: 'handleClickToggleReplace',
      params: ['FindWidget.toggleReplace'],
    },
    {
      name: 'handleInputBlur',
      params: ['FindWidget.handleBlur'],
    },
    {
      name: 'handleReplaceInput',
      params: ['FindWidget.handleReplaceInput', 'event.target.value'],
    },
    {
      name: 'handleReplaceFocus',
      params: ['FindWidget.handleReplaceFocus'],
    },
    {
      name: 'handleFocus',
      params: ['FindWidget.handleFocus'],
    },
    {
      name: 'handleToggleReplaceFocus',
      params: ['FindWidget.handleToggleReplaceFocus'],
    },
    {
      name: 'handleFocusPrevious',
      params: ['FindWidget.handleFocusPrevious'],
    },
    {
      name: 'handleFocusNext',
      params: ['FindWidget.handleFocusNext'],
    },
    {
      name: 'handleFocusClose',
      params: ['FindWidget.handleFocusClose'],
    },
    {
      name: 'handleFocusReplaceAll',
      params: ['FindWidget.handleFocusReplaceAll'],
    },
  ]
}
