import * as CreateMeasureContext from '../CreateMeasureContext/CreateMeasureContext.ts'
import * as MeasureTextWidthState from '../MeasureTextWidthState/MeasureTextWidthState.ts'

export const getContext = () => {
  const ctx = MeasureTextWidthState.getOrCreate(CreateMeasureContext.createMeasureContext)
  return ctx
}
