export default function TrustSeal({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Métodos basados en la ciencia de la lectura y el aprendizaje"
    >
      <defs>
        <path id="seal-top" d="M 36,100 A 64,64 0 0 1 164,100" fill="none" />
        <path id="seal-bottom" d="M 42,112 A 58,58 0 0 0 158,112" fill="none" />
      </defs>

      {/* Aro dorado dentado */}
      <circle cx="100" cy="100" r="96" fill="#f5c518" />
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i / 36) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={100 + Math.cos(a) * 96}
            cy={100 + Math.sin(a) * 96}
            r="5"
            fill="#f5c518"
          />
        );
      })}

      <circle cx="100" cy="100" r="86" fill="#0b2a4a" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="#f5c518" strokeWidth="1.5" />

      {/* Texto curvo */}
      <text
        fill="#f5c518"
        fontSize="12.5"
        fontWeight="700"
        letterSpacing="1.2"
        fontFamily="Arial, sans-serif"
      >
        <textPath href="#seal-top" startOffset="50%" textAnchor="middle">
          MÉTODOS CON BASE
        </textPath>
      </text>
      <text
        fill="#bcd3ea"
        fontSize="9.5"
        fontWeight="600"
        letterSpacing="1.5"
        fontFamily="Arial, sans-serif"
      >
        <textPath href="#seal-bottom" startOffset="50%" textAnchor="middle">
          LECTURA · MEMORIA · APRENDIZAJE
        </textPath>
      </text>

      {/* Check central */}
      <circle cx="100" cy="86" r="24" fill="#f5c518" />
      <path
        d="M 90,86 l 6,7 l 14,-15"
        fill="none"
        stroke="#0b2a4a"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="100"
        y="126"
        fill="#ffffff"
        fontSize="15"
        fontWeight="800"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
      >
        CIENTÍFICA
      </text>
      <text
        x="100"
        y="141"
        fill="#bcd3ea"
        fontSize="8"
        fontWeight="600"
        letterSpacing="1"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
      >
        RESPALDO EN INVESTIGACIÓN
      </text>
    </svg>
  );
}
