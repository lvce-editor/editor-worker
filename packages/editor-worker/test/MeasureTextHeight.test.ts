import { afterEach, expect, test } from '@jest/globals'
import { remove, RendererWorker, RpcId } from '@lvce-editor/rpc-registry'
import * as MeasureTextHeight from '../src/parts/MeasureTextHeight/MeasureTextHeight.ts'

afterEach(() => {
  remove(RpcId.RendererWorker)
})

test('measures wrapped text through the renderer worker', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'MeasureTextHeight.measureTextBlockHeight'(text: string, fontFamily: string, fontSize: number, lineHeight: string, width: number) {
      expect({ fontFamily, fontSize, lineHeight, text, width }).toEqual({
        fontFamily: 'Fira Code',
        fontSize: 15,
        lineHeight: '20px',
        text: 'long diagnostic text',
        width: 582,
      })
      return 60
    },
  })

  await expect(MeasureTextHeight.measureTextBlockHeight('long diagnostic text', 'Fira Code', 15, '20px', 582)).resolves.toBe(60)
})
