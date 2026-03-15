import { create } from 'zustand'

export type AnnotationTool =
  | 'arrow'
  | 'rectangle'
  | 'ellipse'
  | 'line'
  | 'pencil'
  | 'highlighter'
  | 'text'
  | 'pixelate'
  | 'blur'
  | 'spotlight'
  | 'counter'
  | 'crop'

export interface AnnotationObject {
  id: string
  type: AnnotationTool
  data: Record<string, unknown>
  timestamp: number
}

interface HistoryEntry {
  objects: AnnotationObject[]
  selectedObjectId: string | null
}

interface EditorState {
  activeTool: AnnotationTool
  color: string
  strokeWidth: number
  fontSize: number
  fontFamily: string
  opacity: number
  objects: AnnotationObject[]
  selectedObjectId: string | null
  undoStack: HistoryEntry[]
  redoStack: HistoryEntry[]
  counterValue: number
  blurIntensity: number
  pixelSize: number
}

interface EditorActions {
  setTool: (tool: AnnotationTool) => void
  setColor: (color: string) => void
  setStrokeWidth: (width: number) => void
  setFontSize: (size: number) => void
  setFontFamily: (family: string) => void
  setOpacity: (opacity: number) => void
  setBlurIntensity: (intensity: number) => void
  setPixelSize: (size: number) => void
  addObject: (obj: AnnotationObject) => void
  removeObject: (id: string) => void
  updateObject: (id: string, data: Partial<AnnotationObject>) => void
  selectObject: (id: string | null) => void
  undo: () => void
  redo: () => void
  clear: () => void
  resetTool: () => void
}

function createHistoryEntry(state: EditorState): HistoryEntry {
  return {
    objects: [...state.objects],
    selectedObjectId: state.selectedObjectId,
  }
}

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  activeTool: 'arrow',
  color: '#ff3b30',
  strokeWidth: 3,
  fontSize: 16,
  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  opacity: 1,
  objects: [],
  selectedObjectId: null,
  undoStack: [],
  redoStack: [],
  counterValue: 1,
  blurIntensity: 10,
  pixelSize: 10,

  setTool: (tool) => set({ activeTool: tool }),
  setColor: (color) => set({ color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  setFontSize: (size) => set({ fontSize: size }),
  setFontFamily: (family) => set({ fontFamily: family }),
  setOpacity: (opacity) => set({ opacity }),
  setBlurIntensity: (intensity) => set({ blurIntensity: intensity }),
  setPixelSize: (size) => set({ pixelSize: size }),

  addObject: (obj) => {
    const state = get()
    const entry = createHistoryEntry(state)
    set({
      objects: [...state.objects, obj],
      undoStack: [...state.undoStack, entry],
      redoStack: [],
      counterValue: obj.type === 'counter' ? state.counterValue + 1 : state.counterValue,
    })
  },

  removeObject: (id) => {
    const state = get()
    const entry = createHistoryEntry(state)
    set({
      objects: state.objects.filter((o) => o.id !== id),
      selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
      undoStack: [...state.undoStack, entry],
      redoStack: [],
    })
  },

  updateObject: (id, data) => {
    const state = get()
    const entry = createHistoryEntry(state)
    set({
      objects: state.objects.map((o) => (o.id === id ? { ...o, ...data } : o)),
      undoStack: [...state.undoStack, entry],
      redoStack: [],
    })
  },

  selectObject: (id) => set({ selectedObjectId: id }),

  undo: () => {
    const state = get()
    if (state.undoStack.length === 0) return

    const currentEntry = createHistoryEntry(state)
    const previousEntry = state.undoStack[state.undoStack.length - 1]

    set({
      objects: previousEntry.objects,
      selectedObjectId: previousEntry.selectedObjectId,
      undoStack: state.undoStack.slice(0, -1),
      redoStack: [...state.redoStack, currentEntry],
    })
  },

  redo: () => {
    const state = get()
    if (state.redoStack.length === 0) return

    const currentEntry = createHistoryEntry(state)
    const nextEntry = state.redoStack[state.redoStack.length - 1]

    set({
      objects: nextEntry.objects,
      selectedObjectId: nextEntry.selectedObjectId,
      undoStack: [...state.undoStack, currentEntry],
      redoStack: state.redoStack.slice(0, -1),
    })
  },

  clear: () => {
    const state = get()
    const entry = createHistoryEntry(state)
    set({
      objects: [],
      selectedObjectId: null,
      undoStack: [...state.undoStack, entry],
      redoStack: [],
      counterValue: 1,
    })
  },

  resetTool: () =>
    set({
      activeTool: 'arrow',
      color: '#ff3b30',
      strokeWidth: 3,
      fontSize: 16,
      opacity: 1,
    }),
}))
