import type { CompletionDetailState } from '../CompletionDetailState/CompletionDetailState.ts'
import * as GetCompletionDetailVirtualDom from '../GetCompletionDetailVirtualDom/GetCompletionDetailVirtualDom.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as RenderParts from '../RenderParts/RenderParts.ts'

const renderContent = {
  isEqual(oldState: CompletionDetailState, newState: CompletionDetailState) {
    return oldState.content === newState.content
  },
  apply(oldState: CompletionDetailState, newState: CompletionDetailState) {
    const dom: any[] = GetCompletionDetailVirtualDom.getCompletionDetailVirtualDom(newState.content)
    return ['Viewlet.setDom2', newState.uid, dom]
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
  return RenderParts.renderParts(render, oldState, newState)
}
