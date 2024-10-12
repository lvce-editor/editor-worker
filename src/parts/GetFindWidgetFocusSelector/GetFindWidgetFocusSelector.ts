import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as Names from '../Names/Names.ts'

// TODO always focus element by name
export const getFindWidgetFocusSelector = (focus: number): string => {
  switch (focus) {
    case FocusKey.FindWidget:
      return `[name="${Names.SearchValue}"]`
    case FocusKey.FindWidgetReplace:
      return `[name="${Names.ReplaceValue}"]`
    case FocusKey.FindWidgetReplaceAllButton:
      return `[name="${Names.ReplaceAll}"]`
    case FocusKey.FindWidgetCloseButton:
      return `[name="${Names.Close}"]`
    case FocusKey.FindWidgetToggleReplace:
      return `[name="${Names.ReplaceAll}"]`
    case FocusKey.FindWidgetFocusNext:
      return `[name="${Names.FocusNext}"]`
    case FocusKey.FindWidgetFocusPrevious:
      return `[name="${Names.FocusPrevious}"]`
    case FocusKey.FindWidgetReplaceButton:
      return `[name="${Names.Replace}"]`
    default:
      return ''
  }
}
