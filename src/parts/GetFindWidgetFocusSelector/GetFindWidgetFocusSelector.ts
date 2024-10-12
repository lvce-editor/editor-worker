import * as FocusKey from '../FocusKey/FocusKey.ts'

// TODO always focus element by name
export const getFindWidgetFocusSelector = (focus: number): string => {
  switch (focus) {
    case FocusKey.FindWidget:
      return `[name="search-value"]`
    case FocusKey.FindWidgetReplace:
      return '[name="replace-value"]'
    case FocusKey.FindWidgetReplaceAll:
      return `[name="replaceAll"]`
    case FocusKey.FindWidgetClose:
      return `[name="close"]`
    case FocusKey.FindWidgetToggleReplace:
      return `[name="ToggleReplace"]`
    default:
      return ''
  }
}
