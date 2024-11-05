import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as Names from '../Names/Names.ts'

// TODO always focus element by name
export const getFindWidgetFocusSelector = (focus: number): string => {
  switch (focus) {
    case FocusKey.FindWidget: {
      return `[name="${Names.SearchValue}"]`
    }
    case FocusKey.FocusFindWidgetReplace: {
      return `[name="${Names.ReplaceValue}"]`
    }
    case FocusKey.FocusFindWidgetReplaceAllButton: {
      return `[name="${Names.ReplaceAll}"]`
    }
    case FocusKey.FocusFindWidgetCloseButton: {
      return `[name="${Names.Close}"]`
    }
    case FocusKey.FocusFindWidgetToggleReplace: {
      return `[name="${Names.ToggleReplace}"]`
    }
    case FocusKey.FocusFindWidgetNextMatchButton: {
      return `[name="${Names.FocusNext}"]`
    }
    case FocusKey.FocusFindWidgetPreviousMatchButton: {
      return `[name="${Names.FocusPrevious}"]`
    }
    case FocusKey.FocusFindWidgetReplaceButton: {
      return `[name="${Names.Replace}"]`
    }
    default: {
      return ''
    }
  }
}
