import * as GetColorPickerVirtualDom from '../GetColorPickerVirtualDom/GetColorPickerVirtualDom.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import type { ColorPickerState } from '../ColorPickerTypes/ColorPickerTypes.ts'

const renderColor = {
  isEqual(oldState: ColorPickerState, newState: ColorPickerState) {
    return oldState.color === newState.color
  },
  apply(oldState: ColorPickerState, newState: ColorPickerState) {
    return [/* method */ RenderMethod.SetColor, /* color */ newState.color]
  },
}

const renderOffsetX = {
  isEqual(oldState: ColorPickerState, newState: ColorPickerState) {
    return oldState.offsetX === newState.offsetX
  },
  apply(oldState: ColorPickerState, newState: ColorPickerState) {
    return [/* method */ RenderMethod.SetOffsetX, /* offsetX */ newState.offsetX]
  },
}

const renderColorPickerDom = {
  isEqual(oldState: ColorPickerState, newState: ColorPickerState) {
    return oldState.min === newState.min && oldState.max === newState.max
  },
  apply(oldState: ColorPickerState, newState: ColorPickerState) {
    const dom = GetColorPickerVirtualDom.getColorPickerVirtualDom()
    return ['Viewlet.setDom2', dom]
  },
}

const render = [renderColorPickerDom, renderColor, renderOffsetX]

export const renderColorPicker = async (oldState: any, newState: any) => {
  const commands = []
  for (const item of render) {
    if (!item.isEqual(oldState, newState)) {
      commands.push(item.apply(oldState, newState))
    }
  }
  return commands
}
