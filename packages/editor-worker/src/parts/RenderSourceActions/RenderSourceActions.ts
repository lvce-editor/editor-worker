import type { SourceActionState } from '../SourceActionState/SourceActionState.ts'
import * as GetSourceActionsVirtualDom from '../GetSourceActionsVirtualDom/GetSourceActionsVirtualDom.ts'
import * as GetVisibleSourceActions from '../GetVisibleSourceActions/GetVisibleSourceActions.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'

const renderSourceActions = {
  isEqual(oldState: SourceActionState, newState: SourceActionState) {
    return oldState.sourceActions === newState.sourceActions && oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldStatem: SourceActionState, newState: SourceActionState) {
    const visible = GetVisibleSourceActions.getVisibleSourceActions(newState.sourceActions, newState.focusedIndex)
    const dom = GetSourceActionsVirtualDom.getSourceActionsVirtualDom(visible)
    return [RenderMethod.SetDom2, newState.uid, dom]
  },
}

const renderBounds = {
  isEqual(oldState: SourceActionState, newState: SourceActionState) {
    return oldState.x === newState.x && oldState.y === newState.y && oldState.width === newState.width && oldState.height === newState.height
  },
  apply(oldState: SourceActionState, newState: SourceActionState) {
    return [RenderMethod.SetBounds, newState.x, newState.y, newState.width, newState.height]
  },
}

const render = [renderSourceActions, renderBounds]

export const doRender = (oldState: SourceActionState, newState: SourceActionState) => {
  const commands = []
  for (const item of render) {
    if (!item.isEqual(oldState, newState)) {
      commands.push(item.apply(oldState, newState))
    }
  }
  return commands
}
