import * as ClassNames from '../ClassNames/ClassNames.ts'
import type { CodeGeneratorState } from '../CodeGeneratorState/CodeGeneratorState.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import * as EditorStrings from '../EditorStrings/EditorStrings.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'

export const getCodeGeneratorVirtualDom = (state: CodeGeneratorState): readonly VirtualDomNode[] => {
  const escapeToClose = EditorStrings.escapeToClose()
  return [
    {
      type: VirtualDomElements.Div,
      className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.CodeGeneratorWidget),
      childCount: 2,
    },
    {
      type: VirtualDomElements.Input,
      className: MergeClassNames.mergeClassNames(ClassNames.CodeGeneratorInput, ClassNames.InputBox),
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.CodeGeneratorMessage,
      childCount: 1,
    },
    text(escapeToClose),
  ]
}
