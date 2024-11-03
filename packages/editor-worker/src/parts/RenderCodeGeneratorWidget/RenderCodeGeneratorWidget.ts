import { CodeGeneratorState } from '../CodeGeneratorState/CodeGeneratorState.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

const getCodeGeneratorVirtualDom = (state: CodeGeneratorState) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet CodeGeneratorWidget',
      childCount: 0,
    },
  ]
}

export const renderCodeGeneratorWidget = (oldState: CodeGeneratorState, newState: CodeGeneratorState): any => {
  const dom = getCodeGeneratorVirtualDom(newState)
  return dom
}
