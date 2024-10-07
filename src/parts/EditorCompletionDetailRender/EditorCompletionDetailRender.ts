import type { CompletionDetailState } from '../CompletionDetailState/CompletionDetailState.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const renderContent = {
  isEqual(oldState: CompletionDetailState, newState: CompletionDetailState) {
    return oldState.content === newState.content
  },
  apply(oldState: CompletionDetailState, newState: CompletionDetailState) {
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
  isEqual(oldState: CompletionDetailState, newState: CompletionDetailState) {
    return oldState.x === newState.x && oldState.y === newState.y && oldState.width === newState.width && oldState.height === newState.height
  },
  apply(oldState: CompletionDetailState, newState: CompletionDetailState) {
    const { x, y, width, height } = newState
    return [/* method */ RenderMethod.SetBounds, /* x */ x, /* y */ y, /* width */ width, /* height */ height]
  },
}
const render = [renderContent, renderBounds]

export const renderFull = (oldState: CompletionDetailState, newState: CompletionDetailState) => {
  const commands = []
  for (const item of render) {
    if (!item.isEqual(oldState, newState)) {
      commands.push(item.apply(oldState, newState))
    }
  }
  return commands
}