interface State {
  ctx: OffscreenCanvasRenderingContext2D | undefined
}

const state: State = {
  ctx: undefined,
}

/**
 * @param {()=>OffscreenCanvasRenderingContext2D} createCtx
 * @returns {OffscreenCanvasRenderingContext2D}
 */
export const getOrCreate = (createCtx: () => OffscreenCanvasRenderingContext2D) => {
  if (state.ctx) {
    return state.ctx
  }
  state.ctx = createCtx()
  return state.ctx
}
