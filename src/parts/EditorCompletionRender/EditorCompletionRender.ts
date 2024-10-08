import * as GetCompletionItemsVirtualDom from '../GetCompletionItemsVirtualDom/GetCompletionItemsVirtualDom.ts'
import * as GetVisibleCompletionItems from '../GetVisibleCompletionItems/GetVisibleCompletionItems.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'

const renderItems = {
  isEqual(oldState: any, newState: any) {
    return (
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY &&
      oldState.focusedIndex === newState.focusedIndex
    )
  },
  apply(oldState: any, newState: any) {
    const visibleItems = GetVisibleCompletionItems.getVisibleItems(
      newState.items,
      newState.itemHeight,
      newState.leadingWord,
      newState.minLineY,
      newState.maxLineY,
      newState.focusedIndex,
    )
    const dom = GetCompletionItemsVirtualDom.getCompletionItemsVirtualDom(visibleItems)
    return ['setDom', dom]
  },
}

const renderBounds = {
  isEqual(oldState: any, newState: any) {
    return (
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY &&
      oldState.x === newState.x &&
      oldState.y === newState.y
    )
  },
  apply(oldState: any, newState: any) {
    const { x, y, width, height } = newState
    return [/* method */ RenderMethod.SetBounds, /* x */ x, /* y */ y, /* width */ width, /* height */ height]
  },
}

const renderHeight = {
  isEqual(oldState: any, newState: any) {
    return oldState.items.length === newState.items.length
  },
  apply(oldState: any, newState: any) {
    const { itemHeight } = newState
    const contentHeight = newState.items.length * itemHeight
    return [/* method */ RenderMethod.SetContentHeight, /* contentHeight */ contentHeight]
  },
}

const renderNegativeMargin = {
  isEqual(oldState: any, newState: any) {
    return oldState.deltaY === newState.deltaY
  },
  apply(oldState: any, newState: any) {
    return [/* method */ RenderMethod.SetNegativeMargin, /* negativeMargin */ -newState.deltaY]
  },
}

const renderScrollBar = {
  isEqual(oldState: any, newState: any) {
    return (
      oldState.negativeMargin === newState.negativeMargin &&
      oldState.deltaY === newState.deltaY &&
      oldState.height === newState.height &&
      oldState.finalDeltaY === newState.finalDeltaY &&
      oldState.items.length === newState.items.length
    )
  },
  apply(oldState: any, newState: any) {
    const total = newState.items.length
    const contentHeight = total * newState.itemHeight
    const scrollBarHeight = ScrollBarFunctions.getScrollBarSize(newState.height, contentHeight, newState.minimumSliderSize)
    const scrollBarY = ScrollBarFunctions.getScrollBarY(
      newState.deltaY,
      newState.finalDeltaY,
      newState.height - newState.headerHeight,
      scrollBarHeight,
    )
    return [/* method */ RenderMethod.SetScrollBar, /* scrollBarY */ scrollBarY, /* scrollBarHeight */ scrollBarHeight]
  },
}

const render = [renderItems, renderBounds, renderHeight, renderNegativeMargin, renderScrollBar]

export const renderCompletion = (oldState: any, newState: any) => {
  const commands = []
  for (const item of render) {
    if (!item.isEqual(oldState, newState)) {
      commands.push(item.apply(oldState, newState))
    }
  }
  return commands
}
