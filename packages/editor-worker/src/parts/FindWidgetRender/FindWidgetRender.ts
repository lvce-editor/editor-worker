import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as GetFindWidgetButtons from '../GetFindWidgedButtons/GetFindWidgetButtons.ts'
import * as GetFindWidgetButtonsEnabled from '../GetFindWidgetButtonsEnabled/GetFindWidgetButtonsEnabled.ts'
import * as GetFindWidgetFocusSelector from '../GetFindWidgetFocusSelector/GetFindWidgetFocusSelector.ts'
import * as GetFindWidgetVirtualDom from '../GetFindWidgetVirtualDom/GetFindWidgetVirtualDom.ts'
import * as GetMatchCountText from '../GetMatchCountText/GetMatchCountText.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as RenderParts from '../RenderParts/RenderParts.ts'
import * as SetFocus from '../SetFocus/SetFocus.ts'

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
      oldState.replaceExpanded === newState.replaceExpanded &&
      oldState.value === newState.value
    )
  },
  apply(oldState: FindWidgetState, newState: FindWidgetState) {
    const matchCountText = GetMatchCountText.getMatchCountText(newState.matchIndex, newState.matchCount)
    const { findButtonsEnabled, replaceButtonsEnabled } = GetFindWidgetButtonsEnabled.getFindWidgetButtonsEnabled(newState.matchCount, newState.value)
    const { findButtons, replaceButtons } = GetFindWidgetButtons.getFindWidgetButtons(findButtonsEnabled, replaceButtonsEnabled)
    const dom = GetFindWidgetVirtualDom.getFindWidgetVirtualDom(
      matchCountText,
      newState.replaceExpanded,
      findButtons,
      replaceButtons,
      newState.matchCase,
      newState.matchWholeWord,
      newState.useRegularExpression,
      newState.matchCount,
      newState.value
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
    return oldState.focused === newState.focused && oldState.focus === newState.focus && oldState.focusSource === newState.focusSource
  },
  apply(oldState: FindWidgetState, newState: FindWidgetState) {
    const key = GetFindWidgetFocusSelector.getFindWidgetFocusSelector(newState.focus)
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

const render = [renderDetails, renderBounds, renderValue, renderFocus]

export const apply = (oldState: FindWidgetState, newState: FindWidgetState) => {
  // TODO avoid side effect
  if (oldState.focus !== newState.focus) {
    SetFocus.setFocus(newState.focus)
  }
  return RenderParts.renderParts(render, oldState, newState)
}
