export interface WidgetLifecycleFunction<T> {
  (widget: T): readonly any[]
}
