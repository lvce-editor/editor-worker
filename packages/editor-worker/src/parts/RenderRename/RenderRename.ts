import type { RenameState } from '../RenameState/RenameState.ts'
import * as GetRenameVirtualDom from '../GetRenameVirtualDom/GetRenameVirtualDom.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as RenderParts from '../RenderParts/RenderParts.ts'

const renderContent = {
  isEqual(oldState: RenameState, newState: RenameState) {
    return false
  },
  apply(oldState: RenameState, newState: RenameState) {
    const dom: readonly any[] = GetRenameVirtualDom.getRenameVirtualDom(newState)
    return [RenderMethod.SetDom2, newState.uid, dom]
  },
}

const renderBounds = {
  isEqual(oldState: RenameState, newState: RenameState) {
    return oldState.x === newState.x && oldState.y === newState.y && oldState.width === newState.width && oldState.height === newState.height
  },
  apply(oldState: RenameState, newState: RenameState) {
    const { x, y, width, height } = newState
    return [/* method */ RenderMethod.SetBounds, /* x */ x, /* y */ y, /* width */ width, /* height */ height]
  },
}

const renderFocus = {
  isEqual(oldState: RenameState, newState: RenameState) {
    return oldState.focused === newState.focused
  },
  apply(oldState: RenameState, newState: RenameState) {
    return [/* method */ 'Viewlet.focusSelector', newState.uid, '.RenameInputBox']
  },
}

const render = [renderContent, renderBounds, renderFocus]

export const renderFull = (oldState: RenameState, newState: RenameState) => {
  return RenderParts.renderParts(render, oldState, newState)
}
