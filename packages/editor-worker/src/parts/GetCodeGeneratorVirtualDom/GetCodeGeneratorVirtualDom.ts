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
      childCount: 2,
      className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.CodeGeneratorWidget),
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: MergeClassNames.mergeClassNames(ClassNames.CodeGeneratorInput, ClassNames.InputBox),
      name: InputName.CodeGeneratorInput,
      placeholder: enterCode,
      type: VirtualDomElements.Input,
    },
    {
      childCount: 1,
      className: ClassNames.CodeGeneratorMessage,
      type: VirtualDomElements.Div,
    },
    text(escapeToClose),
  ]
}
