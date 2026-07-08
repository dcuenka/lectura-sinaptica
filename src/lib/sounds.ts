// Sonidos generados con Web Audio API (sin archivos externos).
// Se activan tras la primera interacción del usuario (política de autoplay).

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, startAt: number, duration: number, type: OscillatorType = "sine", gain = 0.15) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, c.currentTime + startAt);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + startAt + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + startAt + duration);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(c.currentTime + startAt);
  osc.stop(c.currentTime + startAt + duration + 0.02);
}

export function playCorrect() {
  tone(660, 0, 0.12, "triangle");
  tone(880, 0.09, 0.14, "triangle");
}

export function playWrong() {
  tone(220, 0, 0.22, "sawtooth", 0.12);
}

export function playFinish() {
  // Pequeño arpegio de celebración.
  tone(523, 0, 0.15, "triangle");
  tone(659, 0.12, 0.15, "triangle");
  tone(784, 0.24, 0.15, "triangle");
  tone(1047, 0.36, 0.25, "triangle");
}

export function playTick() {
  tone(440, 0, 0.05, "square", 0.06);
}
