import type { CodeGeneratorState } from '../CodeGeneratorState/CodeGeneratorState.ts'
import * as GetCodeGeneratorVirtualDom from '../GetCodeGeneratorVirtualDom/GetCodeGeneratorVirtualDom.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'

const renderContent = {
  apply(oldState: CodeGeneratorState, newState: CodeGeneratorState) {
    const dom: readonly any[] = GetCodeGeneratorVirtualDom.getCodeGeneratorVirtualDom(newState)
    return [RenderMethod.SetDom2, newState.uid, dom]
  },
  isEqual(oldState: CodeGeneratorState, newState: CodeGeneratorState) {
    return oldState.questions === newState.questions
  },
}

const renderBounds = {
  apply(oldState: CodeGeneratorState, newState: CodeGeneratorState) {
    const { height, width, x, y } = newState
    return [/* method */ RenderMethod.SetBounds, /* x */ x, /* y */ y, /* width */ width, /* height */ height]
  },
  isEqual(oldState: CodeGeneratorState, newState: CodeGeneratorState) {
    return oldState.x === newState.x && oldState.y === newState.y && oldState.width === newState.width && oldState.height === newState.height
  },
}

const renderFocus = {
  apply(oldState: CodeGeneratorState, newState: CodeGeneratorState) {
    return [RenderMethod.Focus, '.CodeGeneratorInput', newState.focusSource]
  },
  isEqual(oldState: CodeGeneratorState, newState: CodeGeneratorState) {
    return oldState.focused === newState.focused && oldState.focusSource === newState.focusSource
  },
}

const render = [renderContent, renderBounds, renderFocus]

export const renderFull = (oldState: CodeGeneratorState, newState: CodeGeneratorState): readonly any[] => {
  const commands: any[] = []
  for (const item of render) {
    if (!item.isEqual(oldState, newState)) {
      commands.push(item.apply(oldState, newState))
    }
  }
  return commands
}
