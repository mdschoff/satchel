import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Pane sizes for the artifact view splits, persisted to localStorage so a
 * layout you've dragged into shape survives app restarts.
 */
interface LayoutState {
  /** Code pane width as a % of the artifact view body. */
  editorPct: number;
  /** Side drawer widths in px. */
  historyWidth: number;
  chatWidth: number;
  setEditorPct: (pct: number) => void;
  setHistoryWidth: (px: number) => void;
  setChatWidth: (px: number) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      editorPct: 45,
      historyWidth: 288,
      chatWidth: 336,
      setEditorPct: (editorPct) => set({ editorPct }),
      setHistoryWidth: (historyWidth) => set({ historyWidth }),
      setChatWidth: (chatWidth) => set({ chatWidth }),
    }),
    { name: "satchel-layout" },
  ),
);
