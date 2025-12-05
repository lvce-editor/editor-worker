import type { HoverState } from '../HoverState/HoverState.ts'
import * as GetHoverVirtualDom from '../GetHoverVirtualDom/GetHoverVirtualDom.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'

const renderHoverDom = {
  apply(oldState: HoverState, newState: HoverState) {
    const dom = GetHoverVirtualDom.getHoverVirtualDom(newState.lineInfos, newState.documentation, newState.diagnostics)
    return [/* method */ RenderMethod.SetDom2, dom]
  },
  isEqual(oldState: HoverState, newState: HoverState) {
    return (
      oldState.lineInfos === newState.lineInfos && oldState.documentation === newState.documentation && oldState.diagnostics === newState.diagnostics
    )
  },
}

const renderBounds = {
  apply(oldState: HoverState, newState: HoverState) {
    const { height, width, x, y } = newState
    return [RenderMethod.SetBounds, x, y, width, height]
  },
  isEqual(oldState: HoverState, newState: HoverState) {
    return oldState.x === newState.x && oldState.y === newState.y
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
