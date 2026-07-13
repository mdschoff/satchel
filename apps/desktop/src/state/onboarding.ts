import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Tracks whether the first-launch welcome has been dismissed. Persisted to
 * localStorage so it shows exactly once - re-openable from Settings.
 */
interface OnboardingState {
  seen: boolean;
  markSeen: () => void;
  reopen: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      seen: false,
      markSeen: () => set({ seen: true }),
      reopen: () => set({ seen: false }),
    }),
    { name: "satchel-onboarding" },
  ),
);
