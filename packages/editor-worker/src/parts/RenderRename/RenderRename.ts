import * as GetRenameVirtualDom from '../GetRenameVirtualDom/GetRenameVirtualDom.ts'
import type { RenameState } from '../RenameState/RenameState.ts'
import * as RenderParts from '../RenderParts/RenderParts.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'

const renderContent = {
  isEqual(oldState: RenameState, newState: RenameState) {
    return false
  },
  apply(oldState: RenameState, newState: RenameState) {
    const dom: readonly any[] = GetRenameVirtualDom.getRenameVirtualDom(newState)
    return ['Viewlet.setDom2', newState.uid, dom]
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

const render = [renderContent, renderBounds]

export const renderFull = (oldState: RenameState, newState: RenameState) => {
  return RenderParts.renderParts(render, oldState, newState)
}
