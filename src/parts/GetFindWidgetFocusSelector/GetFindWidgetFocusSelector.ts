import * as FocusKey from '../FocusKey/FocusKey.ts'

// TODO always focus element by name
export const getFindWidgetFocusSelector = (focus: number): string => {
  switch (focus) {
    case FocusKey.FindWidget:
      return `[name="search-value"]`
    case FocusKey.FindWidgetReplace:
      return '[name="replace-value"]'
    case FocusKey.FindWidgetReplaceAllButton:
      return `[name="ReplaceAll"]`
    case FocusKey.FindWidgetCloseButton:
      return `[name="Close"]`
    case FocusKey.FindWidgetToggleReplace:
      return `[name="ToggleReplace"]`
    case FocusKey.FindWidgetFocusNext:
      return `[name="FocusNext"]`
    case FocusKey.FindWidgetFocusPrevious:
      return `[name="FocusPrevious"]`
    default:
      return ''
  }
}
