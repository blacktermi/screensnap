import { create } from 'zustand'

export type RecordingMode = 'video' | 'gif'

export type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped'

interface RecordingStoreState {
  isRecording: boolean
  isPaused: boolean
  recordingMode: RecordingMode
  recordingState: RecordingState
  duration: number
  hasAudio: boolean
  hasWebcam: boolean
  showClicks: boolean
  showKeystrokes: boolean
  fps: number
}

interface RecordingActions {
  start: (mode: RecordingMode) => void
  pause: () => void
  resume: () => void
  stop: () => void
  setMode: (mode: RecordingMode) => void
  setDuration: (duration: number) => void
  toggleAudio: () => void
  toggleWebcam: () => void
  toggleClicks: () => void
  toggleKeystrokes: () => void
  setFps: (fps: number) => void
  reset: () => void
}

const initialState: RecordingStoreState = {
  isRecording: false,
  isPaused: false,
  recordingMode: 'video',
  recordingState: 'idle',
  duration: 0,
  hasAudio: false,
  hasWebcam: false,
  showClicks: true,
  showKeystrokes: false,
  fps: 30,
}

export const useRecordingStore = create<RecordingStoreState & RecordingActions>((set) => ({
  ...initialState,

  start: (mode) =>
    set({
      isRecording: true,
      isPaused: false,
      recordingMode: mode,
      recordingState: 'recording',
      duration: 0,
    }),

  pause: () =>
    set({
      isPaused: true,
      recordingState: 'paused',
    }),

  resume: () =>
    set({
      isPaused: false,
      recordingState: 'recording',
    }),

  stop: () =>
    set({
      isRecording: false,
      isPaused: false,
      recordingState: 'stopped',
    }),

  setMode: (mode) => set({ recordingMode: mode }),

  setDuration: (duration) => set({ duration }),

  toggleAudio: () => set((state) => ({ hasAudio: !state.hasAudio })),

  toggleWebcam: () => set((state) => ({ hasWebcam: !state.hasWebcam })),

  toggleClicks: () => set((state) => ({ showClicks: !state.showClicks })),

  toggleKeystrokes: () => set((state) => ({ showKeystrokes: !state.showKeystrokes })),

  setFps: (fps) => set({ fps }),

  reset: () => set(initialState),
}))
