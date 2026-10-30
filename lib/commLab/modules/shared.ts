/** Helpers shared by the module files (lib/commLab/modules/*). */
import type { VoicePrompt } from "../types";

/** A voice prompt with the default speaking tips unless it brings its own. */
export const v = (p: Omit<VoicePrompt, "tips"> & { tips?: string[] }): VoicePrompt => ({ tips: ["Breathe in before you start.", "Speak a little slower than feels natural.", "Pause instead of saying \"um\"."], ...p });
