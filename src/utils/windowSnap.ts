import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { PhysicalPosition } from '@tauri-apps/api/window'

import { getCursorMonitor } from './monitor'

export async function snapWindowToEdge() {
  const monitorData = await getCursorMonitor()
  if (!monitorData) return

  const { size, position: screenPos } = monitorData
  const appWindow = getCurrentWebviewWindow()
  const winSize = await appWindow.innerSize()
  const winPos = await appWindow.outerPosition()

  const snapThreshold = Math.min(size.width, size.height) / 13

  let newX = winPos.x
  let newY = winPos.y

  const relX = winPos.x - screenPos.x
  const relY = winPos.y - screenPos.y

  if (Math.abs(relX) < snapThreshold || relX < 0) {
    newX = screenPos.x
  } else if ((relX + winSize.width) > size.width - snapThreshold) {
    newX = screenPos.x + size.width - winSize.width
  }

  if (Math.abs(relY) < snapThreshold || relY < 0) {
    newY = screenPos.y
  } else if ((relY + winSize.height) > size.height - snapThreshold) {
    newY = screenPos.y + size.height - winSize.height
  }

  if (newX !== winPos.x || newY !== winPos.y) {
    await appWindow.setPosition(new PhysicalPosition({ x: newX, y: newY }))
  }
}
