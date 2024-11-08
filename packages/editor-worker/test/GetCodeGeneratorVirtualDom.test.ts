import { expect, test } from '@jest/globals'
import * as CodeGeneratorWidgetFactory from '../src/parts/CodeGeneratorWidgetFactory/CodeGeneratorWidgetFactory.ts'
import * as GetCodeGeneratorVirtualDom from '../src/parts/GetCodeGeneratorVirtualDom/GetCodeGeneratorVirtualDom.ts'

test('getCodeGeneratorVirtualDom', () => {
  const { newState } = CodeGeneratorWidgetFactory.create()
  const dom = GetCodeGeneratorVirtualDom.getCodeGeneratorVirtualDom(newState)
  expect(dom).toEqual([
    {
      childCount: 2,
      className: 'Viewlet CodeGeneratorWidget',
      type: 4,
    },
    {
      childCount: 0,
      className: 'CodeGeneratorInput InputBox',
      name: 'CodeGeneratorInput',
      placeholder: 'Enter Code',
      type: 6,
    },
    {
      childCount: 1,
      className: 'CodeGeneratorMessage',
      type: 4,
    },
    {
      childCount: 0,
      text: 'Escape to close',
      type: 12,
    },
  ])
})
