import * as ClassNames from '../ClassNames/ClassNames.ts'
import type { CodeGeneratorState } from '../CodeGeneratorState/CodeGeneratorState.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'

export const getCodeGeneratorVirtualDom = (state: CodeGeneratorState): readonly VirtualDomNode[] => {
  return [
    {
      type: VirtualDomElements.Div,
      className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.CodeGeneratorWidget),
      childCount: 2,
    },
    {
      type: VirtualDomElements.Input,
      className: 'CodeGeneratorInput',
      childCount: 0,
    },
    text('Escape to close'),
  ]
}
