import * as GetHoverVirtualDom from '../GetHoverVirtualDom/GetHoverVirtualDom.ts'
import type { HoverState } from '../HoverState/HoverState.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'

const renderHoverDom = {
  isEqual(oldState: HoverState, newState: HoverState) {
    return (
      oldState.lineInfos === newState.lineInfos && oldState.documentation === newState.documentation && oldState.diagnostics === newState.diagnostics
    )
  },
  apply(oldState: HoverState, newState: HoverState) {
    const dom = GetHoverVirtualDom.getHoverVirtualDom(newState.lineInfos, newState.documentation, newState.diagnostics)
    return [/* method */ RenderMethod.SetDom2, dom]
  },
}

const renderBounds = {
  isEqual(oldState: HoverState, newState: HoverState) {
    return oldState.x === newState.x && oldState.y === newState.y
  },
  apply(oldState: HoverState, newState: HoverState) {
    const { x, y, width, height } = newState
    return [RenderMethod.SetBounds, x, y, width, height]
  },
}

const render = [renderHoverDom, renderBounds]

export const renderHover = (oldState: HoverState, newState: HoverState) => {
  const commands = []
  for (const item of render) {
    if (!item.isEqual(oldState, newState)) {
      commands.push(item.apply(oldState, newState))
    }
  }
  return commands
}
