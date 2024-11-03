import type { CodeGeneratorState } from '../CodeGeneratorState/CodeGeneratorState.ts'
import * as GetCodeGeneratorVirtualDom from '../GetCodeGeneratorVirtualDom/GetCodeGeneratorVirtualDom.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'

export const renderCodeGeneratorWidget = (oldState: CodeGeneratorState, newState: CodeGeneratorState): readonly VirtualDomNode[] => {
  const dom = GetCodeGeneratorVirtualDom.getCodeGeneratorVirtualDom(newState)
  return dom
}
