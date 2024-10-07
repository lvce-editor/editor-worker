import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const renderContent = {
  isEqual(oldState: any, newState: any) {
    return oldState.content === newState.content
  },
  apply(oldState: any, newState: any) {
    const dom: any[] = [
      {
        type: VirtualDomElements.Div,
        childCount: 1,
      },
      text(newState.content),
    ]
    return ['setDom', dom]
  },
}

const renderBounds = {
  isEqual(oldState: any, newState: any) {
    return oldState.x === newState.x && oldState.y === newState.y && oldState.width === newState.width && oldState.height === newState.height
  },
  apply(oldState: any, newState: any) {
    const { x, y, width, height } = newState
    return [/* method */ RenderMethod.SetBounds, /* x */ x, /* y */ y, /* width */ width, /* height */ height]
  },
}
const render = [renderContent, renderBounds]

export const renderFull = (oldState: any, newState: any) => {
  const commands = []
  for (const item of render) {
    if (!item.isEqual(oldState, newState)) {
      commands.push(item.apply(oldState, newState))
    }
  }
  return commands
}
