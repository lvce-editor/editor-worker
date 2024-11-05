import * as WidgetRegistry from '../WidgetRegistry/WidgetRegistry.ts'

export const addWidget = (widget: any) => {
  const module = WidgetRegistry.get(widget.id)
  if (!module) {
    throw new Error('unsupported widget')
  }
  return module.add(widget)
}

export const renderWidget = (widget: any) => {
  const module = WidgetRegistry.get(widget.id)
  if (!module) {
    throw new Error('unsupported widget')
  }
  return module.render(widget)
}

export const removeWidget = (widget: any) => {
  const module = WidgetRegistry.get(widget.id)
  if (!module) {
    throw new Error('unsupported widget')
  }
  return module.remove(widget)
}
