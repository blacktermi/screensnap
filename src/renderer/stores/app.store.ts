import { create } from 'zustand'

export type AppView =
  | 'hidden'
  | 'overlay'
  | 'editor'
  | 'settings'
  | 'history'
  | 'pin'
  | 'video-editor'
  | 'capture-selection'
  | 'backgrounds'

export type Theme = 'light' | 'dark' | 'system'

interface AppState {
  currentView: AppView
  theme: Theme
  language: string
}

interface AppActions {
  setView: (view: AppView) => void
  setTheme: (theme: Theme) => void
  setLanguage: (language: string) => void
}

export const useAppStore = create<AppState & AppActions>((set) => ({
  currentView: 'hidden',
  theme: 'system',
  language: 'fr',

  setView: (view) => set({ currentView: view }),
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
}))
