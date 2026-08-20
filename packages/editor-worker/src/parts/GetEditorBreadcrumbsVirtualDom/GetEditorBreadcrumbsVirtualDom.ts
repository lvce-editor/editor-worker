import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as AriaBoolean from '../AriaBoolean/AriaBoolean.ts'
import { getEditorBreadcrumbs, type EditorBreadcrumbState } from '../GetEditorBreadcrumbs/GetEditorBreadcrumbs.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const separator: VirtualDomNode = {
  ariaHidden: AriaBoolean.True,
  childCount: 0,
  className: MergeClassNames.mergeClassNames('EditorBreadcrumbSeparator', 'MaskIcon', 'MaskIconChevronRight'),
  type: VirtualDomElements.Span,
}

export const getEditorBreadcrumbsVirtualDom = (state: EditorBreadcrumbState): readonly VirtualDomNode[] => {
  const breadcrumbs = getEditorBreadcrumbs(state)
  const children: VirtualDomNode[] = []
  for (let index = 0; index < breadcrumbs.length; index++) {
    const breadcrumb = breadcrumbs[index]
    if (index > 0) {
      children.push(separator)
    }
    children.push(
      {
        childCount: 1,
        className: MergeClassNames.mergeClassNames(
          'EditorBreadcrumb',
          breadcrumb.kind === 'symbol' ? 'EditorBreadcrumbSymbol' : 'EditorBreadcrumbFile',
        ),
        'data-kind': breadcrumb.kind,
        ...(breadcrumb.symbolKind !== undefined && { 'data-symbolKind': breadcrumb.symbolKind }),
        type: VirtualDomElements.Span,
      },
      text(breadcrumb.label),
    )
  }
  return [
    {
      ariaLabel: 'Breadcrumbs',
      childCount: children.length,
      className: 'EditorBreadcrumbs',
      type: VirtualDomElements.Nav,
    },
    ...children,
  ]
}
