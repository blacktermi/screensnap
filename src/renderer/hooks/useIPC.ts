import { useCallback, useEffect } from 'react'

/**
 * API Electron exposee via le preload script (contextBridge).
 */
interface ElectronAPI {
  invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
  on: (channel: string, callback: (...args: unknown[]) => void) => void
  off: (channel: string, callback: (...args: unknown[]) => void) => void
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

/**
 * Hook pour la communication IPC type-safe entre le renderer et le main process.
 */
export function useIPC() {
  const isElectron = typeof window !== 'undefined' && !!window.electronAPI

  const invoke = useCallback(
    async <T = unknown>(channel: string, ...args: unknown[]): Promise<T> => {
      if (!isElectron) {
        console.warn(`[IPC] Environnement non-Electron, appel ignoré : ${channel}`)
        return undefined as T
      }
      try {
        const result = await window.electronAPI!.invoke(channel, ...args)
        return result as T
      } catch (error) {
        console.error(`[IPC] Erreur sur le canal ${channel}:`, error)
        throw error
      }
    },
    [isElectron],
  )

  const on = useCallback(
    (channel: string, callback: (...args: unknown[]) => void) => {
      if (!isElectron) return
      window.electronAPI!.on(channel, callback)
    },
    [isElectron],
  )

  const off = useCallback(
    (channel: string, callback: (...args: unknown[]) => void) => {
      if (!isElectron) return
      window.electronAPI!.off(channel, callback)
    },
    [isElectron],
  )

  return { invoke, on, off, isElectron }
}

/**
 * Hook pour ecouter un canal IPC specifique.
 * Se desabonne automatiquement au demontage du composant.
 */
export function useIPCListener(channel: string, callback: (...args: unknown[]) => void) {
  const { on, off, isElectron } = useIPC()

  useEffect(() => {
    if (!isElectron) return

    on(channel, callback)
    return () => {
      off(channel, callback)
    }
  }, [channel, callback, on, off, isElectron])
}
