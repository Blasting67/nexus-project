import React from 'react'
import { lerp } from '../atlasData'
import { animVars } from '../animVars'

interface MascotProps {
  /** fuerza de su bando, de 0 a 1 (porcentaje de compradores o de vendedores) */
  power: number
  className?: string
}

const STEAM = [
  { x: 49, dx: -9, d: 0 },
  { x: 71, dx: 9, d: 0.5 },
]

/**
 * Toro (bull market): crece, patea y echa vapor cuando dominan los compradores;
 * se encoge y se preocupa cuando dominan los vendedores.
 */
export const BullMascot: React.FC<MascotProps> = ({ power, className = '' }) => {
  const strong = power > 0.5
  const scale = lerp(0.8, 1.1, power)
  const angry = power > 0.45
  const steam = Math.max(0, (power - 0.5) * 2)

  return (
    <svg viewBox="0 0 120 112" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="bl-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="bl-horn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff7e6" />
          <stop offset="100%" stopColor="#f2d29a" />
        </linearGradient>
        <linearGradient id="bl-muzzle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ecfdf5" />
          <stop offset="100%" stopColor="#a7f3d0" />
        </linearGradient>
        <radialGradient id="bl-aura" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="60" cy="62" r="56" fill="url(#bl-aura)" opacity={0.25 + 0.75 * power} className="sc-pulse sc-fb sc-oc" style={animVars({ '--d': '2.4s', '--s': 1.1 })} />

      <g
        style={{ transform: `scale(${scale})`, transformOrigin: '60px 104px', opacity: 0.78 + 0.22 * power }}
      >
        <g className={strong ? 'sc-stomp' : 'sc-breathe'} style={animVars({ '--d': `${strong ? lerp(0.8, 0.38, power) : 3}s` })}>
          {/* cuernos */}
          <path d="M33 46 C14 48 5 32 10 12 C16 25 27 31 42 33 Z" fill="url(#bl-horn)" stroke="#d6b27a" strokeWidth="0.8" />
          <path d="M87 46 C106 48 115 32 110 12 C104 25 93 31 78 33 Z" fill="url(#bl-horn)" stroke="#d6b27a" strokeWidth="0.8" />
          <path d="M10 12 C12 18 14 22 17 26 C13 22 10 18 10 12 Z" fill="#7c4a1e" />
          <path d="M110 12 C108 18 106 22 103 26 C107 22 110 18 110 12 Z" fill="#7c4a1e" />

          {/* orejas */}
          <ellipse cx="21" cy="58" rx="12" ry="6.5" transform="rotate(-24 21 58)" fill="#15803d" />
          <ellipse cx="22" cy="58" rx="7" ry="3.4" transform="rotate(-24 22 58)" fill="#fbcfe8" />
          <ellipse cx="99" cy="58" rx="12" ry="6.5" transform="rotate(24 99 58)" fill="#15803d" />
          <ellipse cx="98" cy="58" rx="7" ry="3.4" transform="rotate(24 98 58)" fill="#fbcfe8" />

          {/* cabeza */}
          <path d="M60 24 C85 24 95 42 93 63 C91 84 78 100 60 100 C42 100 29 84 27 63 C25 42 35 24 60 24 Z" fill="url(#bl-skin)" />
          <ellipse cx="50" cy="38" rx="14" ry="7" fill="#fff" opacity="0.18" />
          <path d="M50 29 Q55 21 60 27 Q65 21 70 29 Q60 26 50 29 Z" fill="#bbf7d0" />

          {/* hocico */}
          <ellipse cx="60" cy="82" rx="26" ry="17" fill="url(#bl-muzzle)" stroke="#6ee7b7" strokeWidth="0.8" />
          <ellipse cx="50" cy="82" rx="3.8" ry="2.8" fill="#14532d" />
          <ellipse cx="70" cy="82" rx="3.8" ry="2.8" fill="#14532d" />
          <path d="M53 91 Q60 95 67 91" fill="none" stroke="#14532d" strokeWidth="1.6" strokeLinecap="round" />
          {/* argolla dorada */}
          <circle cx="60" cy="97" r="7.2" fill="none" stroke="#f59e0b" strokeWidth="2.6" />
          <circle cx="60" cy="97" r="7.2" fill="none" stroke="#fde68a" strokeWidth="0.9" strokeDasharray="6 40" />

          {/* ojos */}
          <g className="sc-blink sc-fb sc-oc">
            <ellipse cx="45" cy="61" rx="6.4" ry="5.4" fill="#fff" />
            <ellipse cx="75" cy="61" rx="6.4" ry="5.4" fill="#fff" />
            <circle cx={angry ? 46 : 45} cy="61.5" r="3.4" fill="#1a2e1f" />
            <circle cx={angry ? 74 : 75} cy="61.5" r="3.4" fill="#1a2e1f" />
            <circle cx="47" cy="60" r="1.2" fill="#fff" />
            <circle cx="73" cy="60" r="1.2" fill="#fff" />
          </g>
          {/* cejas: furiosas si domina, preocupadas si pierde */}
          <path d={angry ? 'M35 50 L53 57' : 'M36 57 L53 51'} stroke="#14532d" strokeWidth="3.6" strokeLinecap="round" />
          <path d={angry ? 'M85 50 L67 57' : 'M84 57 L67 51'} stroke="#14532d" strokeWidth="3.6" strokeLinecap="round" />

          {/* vapor por la nariz */}
          {steam > 0.03 && (
          <g fill="#fff" opacity={steam}>
            {STEAM.map((s) => (
              <circle key={s.x} cx={s.x} cy="86" r="3.4" className="sc-steam sc-fb sc-oc" style={{ ...animVars({ '--d': `${lerp(1.9, 1.1, power)}s`, '--dx': `${s.dx}px` }), animationDelay: `${s.d}s` }} />
            ))}
          </g>
          )}

          {/* gota de sudor si va perdiendo */}
          {power < 0.4 && <path d="M96 40 Q100 47 96 51 Q92 47 96 40 Z" fill="#7dd3fc" className="sc-sweat" />}
        </g>
      </g>

      {/* insignia alcista */}
      <g transform="translate(103 96)">
        <circle r="10" fill="#fff" stroke="#22c55e" strokeWidth="2.2" />
        <path d="M0 -5 L5.4 3.6 L-5.4 3.6 Z" fill="#16a34a" />
      </g>
    </svg>
  )
}

/**
 * Oso (bear market): domina cuando hay más vendedores; se agranda, gruñe y resopla.
 */
export const BearMascot: React.FC<MascotProps> = ({ power, className = '' }) => {
  const strong = power > 0.5
  const scale = lerp(0.8, 1.1, power)
  const angry = power > 0.45
  const puff = Math.max(0, (power - 0.5) * 2)

  return (
    <svg viewBox="0 0 120 112" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="br-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
        <linearGradient id="br-muzzle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="100%" stopColor="#fda4af" />
        </linearGradient>
        <radialGradient id="br-aura" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="60" cy="62" r="56" fill="url(#br-aura)" opacity={0.25 + 0.75 * power} className="sc-pulse sc-fb sc-oc" style={animVars({ '--d': '2.4s', '--s': 1.1 })} />

      <g style={{ transform: `scale(${scale})`, transformOrigin: '60px 104px', opacity: 0.78 + 0.22 * power }}>
        <g className="sc-head sc-fb" style={{ transformOrigin: '50% 100%', ...animVars({ '--d': `${strong ? lerp(2.8, 1.2, power) : 4}s` }) }}>
          {/* orejas */}
          <circle cx="27" cy="32" r="14" fill="#be123c" />
          <circle cx="27" cy="32" r="7.4" fill="#fda4af" />
          <circle cx="93" cy="32" r="14" fill="#be123c" />
          <circle cx="93" cy="32" r="7.4" fill="#fda4af" />

          {/* cabeza */}
          <ellipse cx="60" cy="62" rx="39" ry="36" fill="url(#br-skin)" />
          <ellipse cx="48" cy="40" rx="15" ry="7" fill="#fff" opacity="0.2" />

          {/* hocico y nariz */}
          <ellipse cx="60" cy="76" rx="21" ry="16" fill="url(#br-muzzle)" stroke="#fb7185" strokeWidth="0.8" />
          <path d="M51 67 Q60 62 69 67 Q67 76 60 78 Q53 76 51 67 Z" fill="#4c0519" />
          <ellipse cx="57" cy="67" rx="3" ry="1.4" fill="#fff" opacity="0.45" />
          <path d="M60 78 V83 M60 83 Q54 89 49 84 M60 83 Q66 89 71 84" fill="none" stroke="#4c0519" strokeWidth="1.9" strokeLinecap="round" />

          {/* ojos */}
          <g className="sc-blink sc-fb sc-oc">
            <circle cx="44" cy="55" r="4.8" fill="#1f0a12" />
            <circle cx="76" cy="55" r="4.8" fill="#1f0a12" />
            <circle cx="45.6" cy="53.4" r="1.5" fill="#fff" />
            <circle cx="77.6" cy="53.4" r="1.5" fill="#fff" />
          </g>
          {/* cejas */}
          <path d={angry ? 'M33 45 L53 53' : 'M34 53 L53 46'} stroke="#4c0519" strokeWidth="3.6" strokeLinecap="round" />
          <path d={angry ? 'M87 45 L67 53' : 'M86 53 L67 46'} stroke="#4c0519" strokeWidth="3.6" strokeLinecap="round" />

          {/* resoplido */}
          {puff > 0.03 && (
          <g fill="#fff" opacity={puff}>
            {[{ x: 52, dx: -9, d: 0 }, { x: 68, dx: 9, d: 0.5 }].map((p) => (
              <circle key={p.x} cx={p.x} cy="82" r="3.2" className="sc-steam sc-fb sc-oc" style={{ ...animVars({ '--d': `${lerp(2, 1.2, power)}s`, '--dx': `${p.dx}px` }), animationDelay: `${p.d}s` }} />
            ))}
          </g>
          )}

          {power < 0.4 && <path d="M96 44 Q100 51 96 55 Q92 51 96 44 Z" fill="#7dd3fc" className="sc-sweat" />}
        </g>
      </g>

      {/* insignia bajista */}
      <g transform="translate(17 96)">
        <circle r="10" fill="#fff" stroke="#ef4444" strokeWidth="2.2" />
        <path d="M0 5 L5.4 -3.6 L-5.4 -3.6 Z" fill="#dc2626" />
      </g>
    </svg>
  )
}