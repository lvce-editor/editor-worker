import * as FindStrings from '../FindStrings/FindStrings.ts'
import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as GetFindWidgetVirtualDom from '../GetFindWidgetVirtualDom/GetFindWidgetVirtualDom.ts'
import * as GetMatchCountText from '../GetMatchCountText/GetMatchCountText.ts'
import * as Icon from '../Icon/Icon.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as RenderParts from '../RenderParts/RenderParts.ts'

export const hasFunctionalRender = true

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
    const buttons = [
      {
        label: FindStrings.previousMatch(),
        icon: Icon.ArrowUp,
        disabled: !buttonsEnabled,
      },
      {
        label: FindStrings.nextMatch(),
        icon: Icon.ArrowDown,
        disabled: !buttonsEnabled,
      },
      {
        label: FindStrings.close(),
        icon: Icon.Close,
        disabled: false,
      },
    ]
    const dom = GetFindWidgetVirtualDom.getFindWidgetVirtualDom(
      matchCountText,
      newState.replaceExpanded,
      buttons,
      newState.matchCase,
      newState.matchWholeWord,
      newState.useRegularExpression
    )
    return [/* method */ 'setDom', /* enabled */ dom]
  },
}

const getAriaLabel = (state: FindWidgetState) => {
  const { matchIndex, matchCount, value } = state
  return FindStrings.matchesFoundFor(matchIndex, matchCount, value)
}

const renderAriaAnnouncement = {
  isEqual(oldState: FindWidgetState, newState: FindWidgetState) {
    return (
      oldState.ariaAnnouncement === newState.ariaAnnouncement &&
      oldState.matchIndex === newState.matchIndex &&
      oldState.matchCount === newState.matchCount &&
      oldState.value === newState.value
    )
  },
  apply(oldState: FindWidgetState, newState: FindWidgetState) {
    const ariaLabel = getAriaLabel(newState)
    return [/* Viewlet.invoke */ 'Viewlet.ariaAnnounce', /* text */ ariaLabel]
  },
}

export const render = [renderAriaAnnouncement, renderDetails, renderValue]

export const apply = (oldState: FindWidgetState, newState: FindWidgetState) => {
  return RenderParts.renderParts(oldState, newState, render)
}
