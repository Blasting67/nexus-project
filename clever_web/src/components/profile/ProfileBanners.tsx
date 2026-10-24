import React, { useId } from 'react'

export const BANNER_STYLES_CSS = `
.pb-root{overflow:hidden;isolation:isolate}
.pb-root svg{position:absolute;inset:0;width:100%;height:100%}
.pb-aurora{transform-box:fill-box;transform-origin:50% 100%;animation:pb-aurora calc(14s / var(--pb-speed,1)) ease-in-out infinite alternate}
@keyframes pb-aurora{0%{transform:translateX(-4%) scaleY(.9) skewX(-6deg)}50%{transform:translateX(3%) scaleY(1.12) skewX(4deg)}100%{transform:translateX(-1%) scaleY(1) skewX(-2deg)}}
.pb-twinkle{animation:pb-twinkle calc(3.4s / var(--pb-speed,1)) ease-in-out infinite}
@keyframes pb-twinkle{0%,100%{opacity:.2}50%{opacity:1}}
.pb-spin{transform-box:fill-box;transform-origin:center;animation:pb-spin calc(120s / var(--pb-speed,1)) linear infinite}
@keyframes pb-spin{to{transform:rotate(360deg)}}
.pb-drift{animation:pb-drift calc(60s / var(--pb-speed,1)) linear infinite}
@keyframes pb-drift{to{transform:translateX(-50%)}}
.pb-drift-slow{animation-duration:calc(110s / var(--pb-speed,1))}
.pb-drift-fast{animation-duration:calc(34s / var(--pb-speed,1))}
.pb-bob{animation:pb-bob calc(7s / var(--pb-speed,1)) ease-in-out infinite}
@keyframes pb-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.pb-meteor{animation:pb-meteor calc(7s / var(--pb-speed,1)) ease-in infinite}
@keyframes pb-meteor{0%{opacity:0;transform:translate(0,0)}6%{opacity:1}22%{opacity:0;transform:translate(-420px,210px)}100%{opacity:0;transform:translate(-420px,210px)}}
.pb-draw{stroke-dasharray:1 1;animation:pb-draw calc(6s / var(--pb-speed,1)) cubic-bezier(.45,0,.2,1) infinite}
@keyframes pb-draw{0%{stroke-dashoffset:1}60%,100%{stroke-dashoffset:0}}
.pb-pulse{transform-box:fill-box;transform-origin:center;animation:pb-pulse 1.8s ease-out infinite}
@keyframes pb-pulse{0%{transform:scale(.6);opacity:.9}100%{transform:scale(2.4);opacity:0}}
.pb-blink{animation:pb-blink 1.4s steps(1) infinite}
@keyframes pb-blink{50%{opacity:.2}}
.pb-glint{animation:pb-glint calc(4s / var(--pb-speed,1)) ease-in-out infinite}
@keyframes pb-glint{0%,100%{opacity:0}50%{opacity:.9}}
@media (prefers-reduced-motion:reduce){.pb-aurora,.pb-twinkle,.pb-spin,.pb-drift,.pb-bob,.pb-meteor,.pb-draw,.pb-pulse,.pb-blink,.pb-glint{animation:none!important}.pb-meteor{opacity:0}}
`

const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

const STARS = Array.from({ length: 90 }, (_, i) => ({ x: rand(i, 1) * 1200, y: rand(i, 2) * 300, r: 0.5 + rand(i, 3) * 1.4, d: rand(i, 4) * 4 }))

const Stars: React.FC<{ maxY?: number; count?: number }> = ({ maxY = 300, count = 90 }) => (
  <g>
    {STARS.slice(0, count)
      .filter((s) => s.y < maxY)
      .map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" className={i % 3 === 0 ? 'pb-twinkle' : undefined} style={{ animationDelay: `${s.d}s` }} opacity={i % 3 === 0 ? undefined : 0.55} />
      ))}
  </g>
)

interface SceneProps {
  a: string
  b: string
  uid: string
}

const spiralArm = (offset: number) => {
  const points: string[] = []
  for (let t = 0; t <= 4.2 * Math.PI; t += 0.18) {
    const radius = 6 * Math.exp(0.24 * t)
    const x = Math.cos(t + offset) * radius
    const y = Math.sin(t + offset) * radius * 0.42
    points.push(`${points.length === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return points.join(' ')
}

const ARMS = [spiralArm(0), spiralArm(Math.PI)]

const ARM_DUST = Array.from({ length: 70 }, (_, i) => {
  const t = rand(i, 21) * 4 * Math.PI
  const radius = 6 * Math.exp(0.24 * t) + (rand(i, 22) - 0.5) * 18
  const offset = i % 2 ? Math.PI : 0
  return { x: Math.cos(t + offset) * radius, y: Math.sin(t + offset) * radius * 0.42, r: 0.6 + rand(i, 23) * 1.6 }
})

const AuroraScene: React.FC<SceneProps> = ({ a, b, uid }) => (
  <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={`${uid}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#040817" />
        <stop offset="0.7" stopColor="#0b1733" />
        <stop offset="1" stopColor="#13234a" />
      </linearGradient>
      <linearGradient id={`${uid}ribbon`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={{ stopColor: b }} stopOpacity="0" />
        <stop offset="0.45" style={{ stopColor: b }} stopOpacity="0.55" />
        <stop offset="1" style={{ stopColor: a }} stopOpacity="0.95" />
      </linearGradient>
      <filter id={`${uid}blur`} x="-20%" y="-50%" width="140%" height="200%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
      <filter id={`${uid}soft`}>
        <feGaussianBlur stdDeviation="4" />
      </filter>
    </defs>
    <rect width="1200" height="300" fill={`url(#${uid}sky)`} />
    <Stars maxY={220} />
    <g filter={`url(#${uid}blur)`} opacity="0.95">
      <path className="pb-aurora" d="M-50 210 C120 60 260 170 420 90 S700 40 860 120 S1120 60 1260 140 L1260 240 L-50 240 Z" fill={`url(#${uid}ribbon)`} />
      <path className="pb-aurora" style={{ animationDelay: '-5s' }} d="M-50 190 C160 110 300 40 480 120 S760 170 920 70 S1150 120 1260 90 L1260 220 L-50 220 Z" fill={`url(#${uid}ribbon)`} opacity="0.7" />
    </g>
    <g filter={`url(#${uid}soft)`} opacity="0.55">
      {Array.from({ length: 26 }).map((_, i) => (
        <rect key={i} className="pb-aurora" style={{ animationDelay: `${-i * 0.4}s` }} x={40 + i * 44} y={70 + Math.sin(i * 0.7) * 30} width="6" height={90 + Math.cos(i * 0.5) * 30} rx="3" fill={`url(#${uid}ribbon)`} />
      ))}
    </g>
    <path d="M0 250 L120 190 L210 230 L330 160 L460 228 L560 182 L690 236 L820 170 L940 224 L1060 186 L1200 230 V300 H0 Z" fill="#0a1226" />
    <path d="M0 270 L140 228 L260 262 L400 214 L520 260 L660 222 L800 266 L930 230 L1080 262 L1200 236 V300 H0 Z" fill="#060c1a" />
    <rect y="282" width="1200" height="18" style={{ fill: a }} opacity="0.12" />
  </svg>
)

const GalaxyScene: React.FC<SceneProps> = ({ a, b, uid }) => (
  <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id={`${uid}neb1`} cx="0.3" cy="0.4" r="0.5">
        <stop offset="0" style={{ stopColor: a }} stopOpacity="0.75" />
        <stop offset="1" style={{ stopColor: a }} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${uid}neb2`} cx="0.72" cy="0.6" r="0.45">
        <stop offset="0" style={{ stopColor: b }} stopOpacity="0.7" />
        <stop offset="1" style={{ stopColor: b }} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${uid}core`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fffbe8" />
        <stop offset="0.25" stopColor="#ffe3a8" stopOpacity="0.9" />
        <stop offset="1" style={{ stopColor: b }} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${uid}planet`} cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
        <stop offset="0.25" style={{ stopColor: a }} />
        <stop offset="1" stopColor="#0b0f24" />
      </radialGradient>
      <filter id={`${uid}blur`}>
        <feGaussianBlur stdDeviation="22" />
      </filter>
      <filter id={`${uid}armblur`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="7" />
      </filter>
    </defs>
    <rect width="1200" height="300" fill="#05051a" />
    <g filter={`url(#${uid}blur)`}>
      <rect width="1200" height="300" fill={`url(#${uid}neb1)`} />
      <rect width="1200" height="300" fill={`url(#${uid}neb2)`} />
    </g>
    <Stars />
    <g transform="translate(420 150)">
      <g className="pb-spin">
        {ARMS.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" style={{ stroke: i ? b : a }} strokeWidth="16" strokeOpacity="0.35" strokeLinecap="round" filter={`url(#${uid}armblur)`} />
            <path d={d} fill="none" stroke="#fff" strokeWidth="1.6" strokeOpacity="0.55" strokeLinecap="round" />
          </g>
        ))}
        {ARM_DUST.map((dot, i) => (
          <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} fill="#fff" opacity={0.4 + (i % 4) * 0.15} />
        ))}
      </g>
      <ellipse cx="0" cy="0" rx="70" ry="26" fill={`url(#${uid}core)`} transform="rotate(-18)" />
      <circle cx="0" cy="0" r="9" fill="#fffbe8" />
    </g>
    <g className="pb-bob">
      <circle cx="1000" cy="130" r="54" fill={`url(#${uid}planet)`} />
      <ellipse cx="1000" cy="132" rx="96" ry="18" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="3" transform="rotate(-14 1000 132)" />
      <path d="M906 150 A96 18 0 0 0 1094 114" fill="none" style={{ stroke: b }} strokeOpacity="0.9" strokeWidth="5" transform="rotate(-14 1000 132)" />
      <circle cx="1078" cy="70" r="9" fill="#cfd8ff" opacity="0.9" />
    </g>
    <line x1="980" y1="20" x2="1080" y2="-30" stroke="#fff" strokeWidth="2" strokeLinecap="round" className="pb-meteor" />
    <line x1="700" y1="40" x2="770" y2="5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" className="pb-meteor" style={{ animationDelay: '3.4s' }} />
  </svg>
)

const MARKET_CANDLES = Array.from({ length: 30 }, (_, i) => {
  const trend = 190 - i * 3.4 + Math.sin(i * 0.8) * 22
  const open = trend + (rand(i, 5) - 0.5) * 30
  const close = trend + (rand(i, 6) - 0.55) * 30
  return { x: 20 + i * 40, open, close, high: Math.min(open, close) - 6 - rand(i, 7) * 16, low: Math.max(open, close) + 6 + rand(i, 8) * 16, vol: 10 + rand(i, 9) * 34 }
})

const MarketTile: React.FC<{ offset: number }> = ({ offset }) => (
  <g transform={`translate(${offset} 0)`}>
    {MARKET_CANDLES.map((c, i) => {
      const up = c.close < c.open
      const color = up ? '#22c55e' : '#f43f5e'
      return (
        <g key={i}>
          <rect x={c.x - 7} y={300 - c.vol} width="14" height={c.vol} fill={color} opacity="0.18" />
          <line x1={c.x} x2={c.x} y1={c.high} y2={c.low} stroke={color} strokeWidth="2" />
          <rect x={c.x - 8} y={Math.min(c.open, c.close)} width="16" height={Math.max(3, Math.abs(c.close - c.open))} rx="2" fill={color} />
        </g>
      )
    })}
  </g>
)

const MarketScene: React.FC<SceneProps> = ({ a, b, uid }) => {
  const line = MARKET_CANDLES.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x} ${((c.open + c.close) / 2 - 8).toFixed(1)}`).join(' ')
  return (
    <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${uid}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#070d1a" />
          <stop offset="1" stopColor="#0d1830" />
        </linearGradient>
        <linearGradient id={`${uid}area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: a }} stopOpacity="0.45" />
          <stop offset="1" style={{ stopColor: a }} stopOpacity="0" />
        </linearGradient>
        <filter id={`${uid}glow`}>
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="1200" height="300" fill={`url(#${uid}bg)`} />
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={`h${i}`} x1="0" x2="1200" y1={30 + i * 42} y2={30 + i * 42} stroke="#fff" strokeOpacity="0.05" />
      ))}
      {Array.from({ length: 16 }).map((_, i) => (
        <line key={`v${i}`} y1="0" y2="300" x1={i * 80} x2={i * 80} stroke="#fff" strokeOpacity="0.04" />
      ))}
      <g className="pb-drift pb-drift-slow" opacity="0.9">
        <MarketTile offset={0} />
        <MarketTile offset={1200} />
      </g>
      <path d={`${line} L1180 300 L20 300 Z`} fill={`url(#${uid}area)`} />
      <path d={line} fill="none" style={{ stroke: b }} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="pb-draw" filter={`url(#${uid}glow)`} />
      <line x1="0" x2="1200" y1="96" y2="96" style={{ stroke: b }} strokeOpacity="0.5" strokeDasharray="8 8" />
      <g transform={`translate(1060 ${(MARKET_CANDLES[26].open + MARKET_CANDLES[26].close) / 2 - 8})`}>
        <circle r="7" style={{ fill: b }} className="pb-pulse" />
        <circle r="5" style={{ fill: b }} />
      </g>
      <g transform={`translate(1086 ${(MARKET_CANDLES[26].open + MARKET_CANDLES[26].close) / 2 + 14})`}>
        <rect width="92" height="26" rx="6" style={{ fill: b }} />
        <text x="46" y="18" textAnchor="middle" fontSize="13" fontWeight="800" fill="#06101f" fontFamily="JetBrains Mono, monospace" className="pb-blink">
          +4.82%
        </text>
      </g>
    </svg>
  )
}

const WAVE_D = (h: number, amp: number) => `M0 ${h} C150 ${h - amp} 300 ${h + amp} 450 ${h} S750 ${h - amp} 900 ${h} S1200 ${h + amp} 1350 ${h} S1650 ${h - amp} 1800 ${h} S2100 ${h + amp} 2400 ${h} V300 H0 Z`

const WavesScene: React.FC<SceneProps> = ({ a, b, uid }) => (
  <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={`${uid}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={{ stopColor: b }} />
        <stop offset="0.75" stopColor="#ffd9a8" />
      </linearGradient>
      <radialGradient id={`${uid}sun`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fff7d6" />
        <stop offset="0.45" stopColor="#ffd27a" />
        <stop offset="1" stopColor="#ffb35c" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${uid}sea`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={{ stopColor: a }} />
        <stop offset="1" stopColor="#06233f" />
      </linearGradient>
    </defs>
    <rect width="1200" height="300" fill={`url(#${uid}sky)`} />
    <circle cx="820" cy="150" r="110" fill={`url(#${uid}sun)`} />
    <circle cx="820" cy="150" r="46" fill="#fff4cc" />
    <g className="pb-drift pb-drift-slow" opacity="0.7">
      {[0, 1200].map((o) => (
        <g key={o} transform={`translate(${o} 0)`}>
          <ellipse cx="200" cy="60" rx="80" ry="14" fill="#fff" opacity="0.6" />
          <ellipse cx="250" cy="50" rx="50" ry="12" fill="#fff" opacity="0.7" />
          <ellipse cx="760" cy="80" rx="100" ry="12" fill="#fff" opacity="0.45" />
        </g>
      ))}
    </g>
    {[
      { y: 140, x: 300 },
      { y: 110, x: 360 },
    ].map((bird, i) => (
      <path key={i} className="pb-bob" style={{ animationDelay: `${i}s` }} d={`M${bird.x} ${bird.y} q10 -10 20 0 q10 -10 20 0`} fill="none" stroke="#1d2b44" strokeWidth="2.5" strokeLinecap="round" />
    ))}
    <g className="pb-drift pb-drift-slow">
      <path d={WAVE_D(175, 14)} style={{ fill: a }} opacity="0.55" />
    </g>
    <rect x="770" y="176" width="100" height="5" rx="2.5" fill="#fff4cc" opacity="0.7" className="pb-glint" />
    <rect x="790" y="192" width="60" height="4" rx="2" fill="#fff4cc" opacity="0.6" className="pb-glint" style={{ animationDelay: '1.2s' }} />
    <g className="pb-drift">
      <path d={WAVE_D(205, 18)} fill={`url(#${uid}sea)`} opacity="0.8" />
    </g>
    <g className="pb-drift pb-drift-fast">
      <path d={WAVE_D(238, 22)} fill={`url(#${uid}sea)`} />
      <path d={WAVE_D(238, 22).replace(/ V300 H0 Z$/, '')} fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="3" />
    </g>
    <g className="pb-drift" style={{ animationDuration: '22s' }}>
      <path d={WAVE_D(270, 16)} fill="#062a4a" />
    </g>
  </svg>
)

const SKY_BUILDINGS = (seed: number, count: number, minH: number, maxH: number) =>
  Array.from({ length: count }, (_, i) => {
    const w = 46 + rand(i, seed) * 60
    return { w, h: minH + rand(i, seed + 1) * (maxH - minH), lit: rand(i, seed + 2) }
  })

const SKY_BACK = SKY_BUILDINGS(11, 18, 70, 150)
const SKY_FRONT = SKY_BUILDINGS(23, 16, 60, 190)

const Skyline: React.FC<{ items: { w: number; h: number; lit: number }[]; fill: string; windows: boolean; base: number }> = ({ items, fill, windows, base }) => {
  let x = -20
  return (
    <g>
      {items.map((b, i) => {
        const bx = x
        x += b.w + 6
        return (
          <g key={i}>
            <rect x={bx} y={base - b.h} width={b.w} height={b.h} fill={fill} />
            {i % 5 === 2 && <rect x={bx + b.w / 2 - 2} y={base - b.h - 30} width="4" height="30" fill={fill} />}
            {i % 5 === 2 && <circle cx={bx + b.w / 2} cy={base - b.h - 32} r="3.5" fill="#ff5a5a" className="pb-blink" />}
            {windows &&
              Array.from({ length: Math.floor((b.h - 16) / 16) }).map((_, r) =>
                Array.from({ length: Math.floor((b.w - 10) / 14) }).map((__, c) => {
                  const on = rand(i * 31 + r * 7 + c, 3) > 0.62
                  return on ? (
                    <rect
                      key={`${r}-${c}`}
                      x={bx + 8 + c * 14}
                      y={base - b.h + 10 + r * 16}
                      width="7"
                      height="8"
                      rx="1"
                      fill="#ffd66b"
                      opacity={0.55 + rand(r, c) * 0.45}
                      className={(r + c + i) % 7 === 0 ? 'pb-twinkle' : undefined}
                      style={{ animationDelay: `${(r + i) * 0.5}s` }}
                    />
                  ) : null
                }),
              )}
          </g>
        )
      })}
    </g>
  )
}

const SkylineScene: React.FC<SceneProps> = ({ a, b, uid }) => (
  <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={`${uid}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0b1030" />
        <stop offset="0.55" style={{ stopColor: b }} />
        <stop offset="1" style={{ stopColor: a }} />
      </linearGradient>
    </defs>
    <rect width="1200" height="300" fill={`url(#${uid}sky)`} />
    <Stars maxY={110} count={60} />
    <circle cx="640" cy="64" r="26" fill="#fff6dc" opacity="0.9" />
    <circle cx="652" cy="56" r="24" fill="#0b1030" opacity="0.55" />
    <g className="pb-drift pb-drift-slow" opacity="0.35">
      {[0, 1200].map((o) => (
        <g key={o} transform={`translate(${o} 0)`}>
          <ellipse cx="420" cy="110" rx="140" ry="10" fill="#fff" />
          <ellipse cx="960" cy="80" rx="110" ry="8" fill="#fff" />
        </g>
      ))}
    </g>
    <g opacity="0.55">
      <Skyline items={SKY_BACK} fill="#1a2350" windows={false} base={260} />
    </g>
    <Skyline items={SKY_FRONT} fill="#0b1029" windows base={300} />
    <rect y="292" width="1200" height="8" style={{ fill: a }} opacity="0.4" />
  </svg>
)

export const ModernBanner: React.FC<{ style: 'aurora' | 'stars' | 'candles' | 'waves' | 'skyline'; colorA: string; colorB: string; speed: number; className?: string }> = ({ style, colorA, colorB, speed, className = '' }) => {
  const uid = `pb${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const props = { a: colorA, b: colorB, uid }
  return (
    <div className={`pb-root ${/(^|\s)(absolute|fixed)(\s|$)/.test(className) ? '' : 'relative'} ${className}`} style={{ '--pb-speed': speed } as React.CSSProperties} aria-hidden="true">
      <style>{BANNER_STYLES_CSS}</style>
      {style === 'aurora' && <AuroraScene {...props} />}
      {style === 'stars' && <GalaxyScene {...props} />}
      {style === 'candles' && <MarketScene {...props} />}
      {style === 'waves' && <WavesScene {...props} />}
      {style === 'skyline' && <SkylineScene {...props} />}
    </div>
  )
}
