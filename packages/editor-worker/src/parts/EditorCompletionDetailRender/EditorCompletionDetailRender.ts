import type { CompletionDetailState } from '../CompletionDetailState/CompletionDetailState.ts'
import * as GetCompletionDetailVirtualDom from '../GetCompletionDetailVirtualDom/GetCompletionDetailVirtualDom.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as RenderParts from '../RenderParts/RenderParts.ts'

const renderContent = {
  apply(oldState: CompletionDetailState, newState: CompletionDetailState) {
    const dom: any[] = GetCompletionDetailVirtualDom.getCompletionDetailVirtualDom(newState.content)
    return [RenderMethod.SetDom2, newState.uid, dom]
  },
  isEqual(oldState: CompletionDetailState, newState: CompletionDetailState) {
    return oldState.content === newState.content
  },
}

const renderBounds = {
  apply(oldState: CompletionDetailState, newState: CompletionDetailState) {
    const { height, width, x, y } = newState
    return [/* method */ RenderMethod.SetBounds, /* x */ x, /* y */ y, /* width */ width, /* height */ height]
  },
  isEqual(oldState: CompletionDetailState, newState: CompletionDetailState) {
    return oldState.x === newState.x && oldState.y === newState.y && oldState.width === newState.width && oldState.height === newState.height
  },
}
const render = [renderContent, renderBounds]

export const renderFull = (oldState: CompletionDetailState, newState: CompletionDetailState) => {
  return RenderParts.renderParts(render, oldState, newState)
}
