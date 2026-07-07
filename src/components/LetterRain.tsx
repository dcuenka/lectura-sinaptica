const CHARS = "aeiourstnmlpbcdfghABCDEFRSTLMNoláeíó".split("");
const WORDS = ["leer", "idea", "luz", "sol", "voz", "meta", "a", "e", "i", "o", "u"];

// Pseudo-aleatorio determinista por índice (evita desajustes de hidratación).
function rand(seed: number) {
  const x = Math.sin(seed * 99.13) * 10000;
  return x - Math.floor(x);
}

/**
 * Lluvia de letras decorativa. Se coloca de forma absoluta dentro de un
 * contenedor con `position: relative`.
 */
export default function LetterRain({ count = 26 }: { count?: number }) {
  const drops = Array.from({ length: count }, (_, i) => {
    const left = rand(i + 1) * 100;
    const duration = 3.5 + rand(i + 2) * 4.5;
    const delay = rand(i + 3) * 5;
    const size = 12 + Math.floor(rand(i + 4) * 18);
    const opacity = 0.5 + rand(i + 5) * 0.5;
    const useWord = rand(i + 6) > 0.8;
    const content = useWord
      ? WORDS[Math.floor(rand(i + 7) * WORDS.length)]
      : CHARS[Math.floor(rand(i + 8) * CHARS.length)];
    return { left, duration, delay, size, opacity, content, key: i };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {drops.map((d) => (
        <span
          key={d.key}
          className="letter-drop font-mono font-semibold"
          style={{
            left: `${d.left}%`,
            fontSize: `${d.size}px`,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
            // @ts-expect-error CSS custom property
            "--drop-opacity": d.opacity,
          }}
        >
          {d.content}
        </span>
      ))}
    </div>
  );
}
