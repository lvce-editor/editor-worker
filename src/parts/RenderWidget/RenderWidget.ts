const renderCompletion = () => {}

const addWidgetCompletion = (widget: any) => {
  console.log({ widget })
  return []
}

export const addWidget = (widget: any) => {
  const { id } = widget
  switch (id) {
    case 'completion':
      return addWidgetCompletion(widget)
    default:
      throw new Error('unsupported widget')
  }
}

export const renderWidget = (widget: any) => {
  const { id } = widget
  switch (id) {
    case 'completion':
      return renderCompletion
    default:
      throw new Error(`unsupported widget`)
  }
}
