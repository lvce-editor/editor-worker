import type { CodeGeneratorState } from '../CodeGeneratorState/CodeGeneratorState.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as EditorStrings from '../EditorStrings/EditorStrings.ts'
import * as InputName from '../InputName/InputName.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const getCodeGeneratorVirtualDom = (state: CodeGeneratorState): readonly VirtualDomNode[] => {
  const escapeToClose = EditorStrings.escapeToClose()
  const enterCode = EditorStrings.enterCode()
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
      placeholder: enterCode,
      name: InputName.CodeGeneratorInput,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.CodeGeneratorMessage,
      childCount: 1,
    },
    text(escapeToClose),
  ]
}
