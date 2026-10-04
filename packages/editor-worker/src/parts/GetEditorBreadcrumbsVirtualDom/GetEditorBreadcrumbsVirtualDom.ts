import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as AriaBoolean from '../AriaBoolean/AriaBoolean.ts'
import { getEditorBreadcrumbs, type EditorBreadcrumbState } from '../GetEditorBreadcrumbs/GetEditorBreadcrumbs.ts'
import { getFileIconVirtualDom } from '../GetFileIconVirtualDom/GetFileIconVirtualDom.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const symbolIcons: Readonly<Record<string, string>> = {
  15: 'String',
  16: 'Number',
  17: 'Boolean',
  18: 'Array',
  19: 'Object',
  21: 'Null',
}

const separator: VirtualDomNode = {
  ariaHidden: AriaBoolean.True,
  childCount: 0,
  className: MergeClassNames.mergeClassNames('EditorBreadcrumbSeparator', 'MaskIcon', 'MaskIconChevronRight'),
  type: VirtualDomElements.Span,
}

export const getEditorBreadcrumbsVirtualDom = (state: EditorBreadcrumbState): readonly VirtualDomNode[] => {
  const { breadcrumbFileIcon } = state
  const breadcrumbs = getEditorBreadcrumbs(state)
  const children: VirtualDomNode[] = []
  for (let index = 0; index < breadcrumbs.length; index++) {
    const breadcrumb = breadcrumbs[index]
    if (index > 0) {
      children.push(separator)
    }
    const isFile = breadcrumb.kind === 'file' && breadcrumbs[index + 1]?.kind !== 'file'
    const icon =
      breadcrumb.kind === 'symbol'
        ? {
            ariaHidden: AriaBoolean.True,
            childCount: 0,
            className: MergeClassNames.mergeClassNames(
              'EditorBreadcrumbIcon',
              'MaskIcon',
              `MaskIconSymbol${symbolIcons[String(breadcrumb.symbolKind)] || 'Default'}`,
            ),
            type: VirtualDomElements.Span,
          }
        : isFile && breadcrumbFileIcon
          ? { ...getFileIconVirtualDom(breadcrumbFileIcon), ariaHidden: AriaBoolean.True }
          : undefined
    children.push(
      {
        childCount: icon ? 2 : 1,
        className: MergeClassNames.mergeClassNames(
          'EditorBreadcrumb',
          breadcrumb.kind === 'symbol' ? 'EditorBreadcrumbSymbol' : 'EditorBreadcrumbFile',
        ),
        'data-kind': breadcrumb.kind,
        ...(breadcrumb.symbolKind !== undefined && { 'data-symbolKind': breadcrumb.symbolKind }),
        type: VirtualDomElements.Span,
      },
      ...(icon ? [icon] : []),
      text(breadcrumb.label),
    )
  }
  return [
    {
      ariaLabel: 'Breadcrumbs',
      childCount: breadcrumbs.length > 0 ? breadcrumbs.length * 2 - 1 : 0,
      className: 'EditorBreadcrumbs',
      type: VirtualDomElements.Nav,
    },
    ...children,
  ]
}
