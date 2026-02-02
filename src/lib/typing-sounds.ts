/**
 * Mechvibes-style typing sounds: load a sound pack (config + ogg), play key slices on keydown.
 * All audio and fetch logic runs only in the browser (SSR-safe).
 */

export type MechvibesConfig = {
  sound: string;
  defines: Record<string, [number, number]>; // key id → [offsetMs, durationMs]
};

let audioContext: AudioContext | null = null;
let buffer: AudioBuffer | null = null;
let defines: Record<string, [number, number]> = {};
let disabled = true;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Load sound pack: use config (imported or passed), fetch ogg, decode to AudioBuffer.
 * On any failure sets internal disabled state and does not throw.
 */
export async function load(config: MechvibesConfig): Promise<void> {
  if (!isBrowser()) return;
  disabled = true;
  buffer = null;
  defines = {};

  if (
    !config?.sound ||
    !config?.defines ||
    typeof config.defines !== "object"
  ) {
    return;
  }

  try {
    const response = await fetch(`/${config.sound}`);
    if (!response.ok) return;
    const arrayBuffer = await response.arrayBuffer();
    const ctx = getAudioContext();
    if (!ctx) return;
    buffer = await ctx.decodeAudioData(arrayBuffer);
    defines = config.defines;
    disabled = false;
  } catch {
    // Silent: no throw, no user-facing error
  }
}

function getAudioContext(): AudioContext | null {
  if (!isBrowser()) return null;
  if (!audioContext) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (Ctx) audioContext = new Ctx();
  }
  return audioContext;
}

/**
 * Play the sound for the given key code if defined in the pack.
 * No-op if disabled, not in browser, or no define for keyCode.
 */
export function playKey(keyCode: number): void {
  if (!isBrowser() || disabled || !buffer) return;
  const define = defines[String(keyCode)];
  if (!define) return;

  const [offsetMs, durationMs] = define;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    const offsetSec = offsetMs / 1000;
    const durationSec = durationMs / 1000;
    source.start(0, offsetSec, durationSec);
  } catch {
    // Silent: e.g. autoplay policy
  }
}
