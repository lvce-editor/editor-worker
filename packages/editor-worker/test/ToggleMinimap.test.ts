import { beforeEach, expect, jest, test } from '@jest/globals'

const getMinimapEnabled = jest.fn<() => Promise<boolean>>()
const update = jest.fn<(settings: Record<string, unknown>) => Promise<void>>()

jest.unstable_mockModule('../src/parts/EditorPreferences/EditorPreferences.ts', () => ({
  getMinimapEnabled,
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.ts', () => ({
  update,
}))

const { toggleMinimap } = await import('../src/parts/ToggleMinimap/ToggleMinimap.ts')

beforeEach(() => {
  getMinimapEnabled.mockReset()
  update.mockReset()
})

test('enables the minimap when disabled', async () => {
  getMinimapEnabled.mockResolvedValue(false)

  await toggleMinimap()

  expect(update).toHaveBeenCalledWith({
    'editor.minimap.enabled': true,
  })
})

test('disables the minimap when enabled', async () => {
  getMinimapEnabled.mockResolvedValue(true)

  await toggleMinimap()

  expect(update).toHaveBeenCalledWith({
    'editor.minimap.enabled': false,
  })
})
