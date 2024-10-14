import * as GetHoverVirtualDom from '../GetHoverVirtualDom/GetHoverVirtualDom.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'

const renderHoverDom = {
  isEqual(oldState: any, newState: any) {
    return (
      oldState.lineInfos === newState.lineInfos &&
      oldState.documentation === newState.documentation &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY &&
      oldState.diagnostics === newState.diagnostics
    )
  },
  apply(oldState: any, newState: any) {
    const dom = GetHoverVirtualDom.getHoverVirtualDom(newState.lineInfos, newState.documentation, newState.diagnostics)
    return [/* method */ 'Viewlet.setDom2', dom]
  },
}

const renderBounds = {
  isEqual(oldState: any, newState: any) {
    return oldState.x === newState.x && oldState.y === newState.y && oldState.resizedWidth === newState.resizedWidth
  },
  apply(oldState: any, newState: any) {
    // @ts-ignore
    const { x, y, width, height, resizedWidth, uid } = newState
    console.log('apply')
    return [RenderMethod.SetBounds, x, y, resizedWidth, height]
  },
}

const render = [renderHoverDom, renderBounds]

export const renderHover = (oldState: any, newState: any) => {
  const commands = []
  for (const item of render) {
    if (!item.isEqual(oldState, newState)) {
      commands.push(item.apply(oldState, newState))
    }
  }
  return commands
}
