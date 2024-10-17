import * as GetSourceActionsVirtualDom from '../GetSourceActionsVirtualDom/GetSourceActionsVirtualDom.ts'
import * as GetVisibleSourceActions from '../GetVisibleSourceActions/GetVisibleSourceActions.ts'
import type { SourceActionState } from '../SourceActionState/SourceActionState.ts'

const renderSourceActions = {
  isEqual(oldState: SourceActionState, newState: SourceActionState) {
    return oldState.sourceActions === newState.sourceActions && oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldStatem: SourceActionState, newState: SourceActionState) {
    const visible = GetVisibleSourceActions.getVisibleSourceActions(newState.sourceActions, newState.focusedIndex)
    const dom = GetSourceActionsVirtualDom.getSourceActionsVirtualDom(visible)
    return ['Viewlet.setDom2', dom]
  },
}

const renderBounds = {
  isEqual(oldState: SourceActionState, newState: SourceActionState) {
    return oldState.x === newState.x && oldState.y === newState.y && oldState.width === newState.width && oldState.height === newState.height
  },
  apply(oldState: SourceActionState, newState: SourceActionState) {
    return ['setBounds', newState.x, newState.y]
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
