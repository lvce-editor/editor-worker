export interface WidgetLifeCycleFunction<T> {
  (widget: T): readonly any[]
}
