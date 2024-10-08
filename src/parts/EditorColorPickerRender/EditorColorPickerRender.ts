import type { ColorPickerState } from '../ColorPickerState/ColorPickerState.ts'
import * as GetCompletionDetailVirtualDom from '../GetCompletionDetailVirtualDom/GetCompletionDetailVirtualDom.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'

const renderContent = {
  isEqual(oldState: ColorPickerState, newState: ColorPickerState) {
    return (
      oldState.color === newState.color && oldState.offsetX === newState.offsetX && oldState.min === newState.min && oldState.max === newState.max
    )
  },
  apply(oldState: ColorPickerState, newState: ColorPickerState) {
    const dom: any[] = GetCompletionDetailVirtualDom.getCompletionDetailVirtualDom(newState.content)
    return ['Viewlet.setDom2', newState.uid, dom]
  },
}

const renderBounds = {
  isEqual(oldState: ColorPickerState, newState: ColorPickerState) {
    return oldState.x === newState.x && oldState.y === newState.y && oldState.width === newState.width && oldState.height === newState.height
  },
  apply(oldState: ColorPickerState, newState: ColorPickerState) {
    const { x, y, width, height } = newState
    return [/* method */ RenderMethod.SetBounds, /* x */ x, /* y */ y, /* width */ width, /* height */ height]
  },
}
const render = [renderContent, renderBounds]

export const renderFull = (oldState: ColorPickerState, newState: ColorPickerState) => {
  const commands = []
  for (const item of render) {
    if (!item.isEqual(oldState, newState)) {
      commands.push(item.apply(oldState, newState))
    }
  }
  return commands
}
