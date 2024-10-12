import * as FindStrings from '../FindStrings/FindStrings.ts'
import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as GetFindWidgetFocusSelector from '../GetFindWidgetFocusSelector/GetFindWidgetFocusSelector.ts'
import * as GetFindWidgetVirtualDom from '../GetFindWidgetVirtualDom/GetFindWidgetVirtualDom.ts'
import * as GetMatchCountText from '../GetMatchCountText/GetMatchCountText.ts'
import * as Icon from '../Icon/Icon.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as RenderParts from '../RenderParts/RenderParts.ts'

const renderValue = {
  isEqual(oldState: FindWidgetState, newState: FindWidgetState) {
    return oldState.value === newState.value
  },
  apply(oldState: FindWidgetState, newState: FindWidgetState) {
    return [RenderMethod.SetValue, /* value */ newState.value]
  },
}

const renderDetails = {
  isEqual(oldState: FindWidgetState, newState: FindWidgetState) {
    return (
      oldState.matchIndex === newState.matchIndex &&
      oldState.matchCount === newState.matchCount &&
      oldState.replaceExpanded === newState.replaceExpanded
    )
  },
  apply(oldState: FindWidgetState, newState: FindWidgetState) {
    const matchCountText = GetMatchCountText.getMatchCountText(newState.matchIndex, newState.matchCount)
    const buttonsEnabled = newState.matchCount > 0
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
    const dom = GetFindWidgetVirtualDom.getFindWidgetVirtualDom(
      matchCountText,
      newState.replaceExpanded,
      findButtons,
      replaceButtons,
      newState.matchCase,
      newState.matchWholeWord,
      newState.useRegularExpression
    )
    return ['Viewlet.setDom2', dom]
  },
}

const renderBounds = {
  isEqual(oldState: FindWidgetState, newState: FindWidgetState) {
    return oldState.x === newState.x && oldState.y === newState.y && oldState.width === newState.width && oldState.height === newState.height
  },
  apply(oldState: FindWidgetState, newState: FindWidgetState) {
    const { x, y, width, height } = newState
    return [/* method */ RenderMethod.SetBounds, /* x */ x, /* y */ y, /* width */ width, /* height */ height]
  },
}

const renderFocus = {
  isEqual(oldState: FindWidgetState, newState: FindWidgetState) {
    console.log('same', oldState.focus, newState.focus)
    return oldState.focused === newState.focused && oldState.focus === newState.focus && oldState.focusSource === newState.focusSource
  },
  apply(oldState: FindWidgetState, newState: FindWidgetState) {
    const key = GetFindWidgetFocusSelector.getFindWidgetFocusSelector(newState.focus)
    console.log({ key })
    return ['focus', key, newState.focusSource]
  },
}
// const getAriaLabel = (state: FindWidgetState) => {
//   const { matchIndex, matchCount, value } = state
//   return FindStrings.matchesFoundFor(matchIndex, matchCount, value)
// }

// const renderAriaAnnouncement = {
//   isEqual(oldState: FindWidgetState, newState: FindWidgetState) {
//     return (
//       oldState.ariaAnnouncement === newState.ariaAnnouncement &&
//       oldState.matchIndex === newState.matchIndex &&
//       oldState.matchCount === newState.matchCount &&
//       oldState.value === newState.value
//     )
//   },
//   apply(oldState: FindWidgetState, newState: FindWidgetState) {
//     const ariaLabel = getAriaLabel(newState)
//     return [/* Viewlet.invoke */ 'Viewlet.ariaAnnounce', /* text */ ariaLabel]
//   },
// }

export const render = [renderDetails, renderBounds, renderValue, renderFocus]

export const apply = (oldState: FindWidgetState, newState: FindWidgetState) => {
  return RenderParts.renderParts(render, oldState, newState)
}
