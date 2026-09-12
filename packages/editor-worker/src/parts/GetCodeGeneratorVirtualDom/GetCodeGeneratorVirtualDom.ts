import type { CodeGeneratorState } from '../CodeGeneratorState/CodeGeneratorState.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as EditorStrings from '../EditorStrings/EditorStrings.ts'
import * as InputName from '../InputName/InputName.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const codeGeneratorNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.CodeGeneratorWidget,
  type: VirtualDomElements.Div,
}

const codeGeneratorMessageNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.CodeGeneratorMessage,
  type: VirtualDomElements.Div,
}

export const getCodeGeneratorVirtualDom = (state: CodeGeneratorState): readonly VirtualDomNode[] => {
  const escapeToClose = EditorStrings.escapeToClose()
  const enterCode = EditorStrings.enterCode()
  return [
    codeGeneratorNode,
    {
      childCount: 0,
      className: ClassNames.CodeGeneratorInput,
      name: InputName.CodeGeneratorInput,
      placeholder: enterCode,
      type: VirtualDomElements.Input,
    },
    codeGeneratorMessageNode,
    text(escapeToClose),
  ]
}
