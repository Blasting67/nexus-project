import React, { useEffect, useRef, useState } from 'react'
import type { AvatarShape, BannerStyle, FrameStyle } from '../../types/profileCustomization'

export const PROFILE_STYLES = `
.pf-banner{position:relative;overflow:hidden;isolation:isolate}
.pf-layer{position:absolute;inset:0}
.pf-gradient{background:linear-gradient(120deg,var(--pf-a),var(--pf-b))}
.pf-aurora-base{background:linear-gradient(120deg,#0b1220,#121c38)}
.pf-night-base{background:linear-gradient(160deg,#050816,#0f1b3d)}
.pf-blob{position:absolute;border-radius:9999px;filter:blur(38px);opacity:.8;will-change:transform}
.pf-blob-a{background:var(--pf-a);width:55%;height:150%;left:-10%;top:-30%;animation:pf-drift-a calc(14s / var(--pf-speed,1)) ease-in-out infinite}
.pf-blob-b{background:var(--pf-b);width:50%;height:140%;right:-8%;top:-25%;animation:pf-drift-b calc(17s / var(--pf-speed,1)) ease-in-out infinite}
.pf-blob-c{background:#ffffff;opacity:.2;width:28%;height:90%;left:38%;top:10%;animation:pf-drift-c calc(11s / var(--pf-speed,1)) ease-in-out infinite}
@keyframes pf-drift-a{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40%,18%) scale(1.25)}}
@keyframes pf-drift-b{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-45%,10%) scale(1.15)}}
@keyframes pf-drift-c{0%,100%{transform:translate(0,0)}50%{transform:translate(-60%,25%)}}
.pf-grid{background-image:linear-gradient(rgba(255,255,255,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.22) 1px,transparent 1px);background-size:28px 28px;animation:pf-grid-move calc(5s / var(--pf-speed,1)) linear infinite}
@keyframes pf-grid-move{to{background-position:28px 28px}}
.pf-wave{position:absolute;left:0;bottom:0;width:200%;animation:pf-wave-move calc(12s / var(--pf-speed,1)) linear infinite}
.pf-wave-1{height:55%}
.pf-wave-2{height:42%;animation-duration:calc(18s / var(--pf-speed,1));animation-direction:reverse}
.pf-wave-3{height:30%;animation-duration:calc(9s / var(--pf-speed,1))}
@keyframes pf-wave-move{to{transform:translateX(-50%)}}
.pf-scroll{position:absolute;left:0;top:0;width:200%;height:100%;animation:pf-wave-move calc(26s / var(--pf-speed,1)) linear infinite}
.pf-star{position:absolute;border-radius:9999px;background:#fff;animation:pf-twinkle calc(3.2s / var(--pf-speed,1)) ease-in-out infinite}
@keyframes pf-twinkle{0%,100%{opacity:.15;transform:scale(.7)}50%{opacity:1;transform:scale(1.25)}}
.pf-meteor{position:absolute;top:-10%;left:85%;width:120px;height:2px;background:linear-gradient(90deg,rgba(255,255,255,0),#fff);opacity:0;animation:pf-meteor calc(6s / var(--pf-speed,1)) ease-in infinite}
@keyframes pf-meteor{0%{opacity:0;transform:translate(0,0) rotate(-35deg)}8%{opacity:1}30%{opacity:0;transform:translate(-520px,360px) rotate(-35deg)}100%{opacity:0;transform:translate(-520px,360px) rotate(-35deg)}}
.pf-cover{position:absolute;inset:0;background-size:cover;background-position:center;animation:pf-kenburns calc(24s / var(--pf-speed,1)) ease-in-out infinite alternate}
@keyframes pf-kenburns{from{transform:scale(1)}to{transform:scale(1.12)}}
.pf-shine{position:absolute;inset:0;pointer-events:none;background:linear-gradient(110deg,transparent 40%,rgba(255,255,255,.28) 50%,transparent 60%);background-size:250% 100%;animation:pf-shine calc(7s / var(--pf-speed,1)) ease-in-out infinite}
@keyframes pf-shine{0%{background-position:150% 0}55%,100%{background-position:-50% 0}}

.pf-frame-rainbow{background:conic-gradient(from 0deg,#ef4444,#f59e0b,#22c55e,#06b6d4,#6366f1,#d946ef,#ef4444);animation:pf-hue 6s linear infinite}
@keyframes pf-hue{to{filter:hue-rotate(360deg)}}
.pf-frame-pulse{animation:pf-pulse 2.4s ease-in-out infinite}
@keyframes pf-pulse{0%,100%{filter:drop-shadow(0 0 2px var(--pf-frame))}50%{filter:drop-shadow(0 0 14px var(--pf-frame))}}
.pf-orbit{position:absolute;animation:pf-spin 5s linear infinite}
.pf-orbit span{position:absolute;top:-2px;left:50%;width:10px;height:10px;margin-left:-5px;border-radius:9999px;background:var(--pf-frame);box-shadow:0 0 10px var(--pf-frame)}
@keyframes pf-spin{to{transform:rotate(360deg)}}
.pf-ring-progress{transition:stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1)}

.pf-tilt{position:relative;transition:transform .15s ease-out;transform-style:preserve-3d}
.pf-tilt::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .2s;background:radial-gradient(circle at var(--pf-gx,50%) var(--pf-gy,50%),rgba(255,255,255,.35),transparent 55%)}
.pf-tilt:hover::after{opacity:1}

.pf-rise{animation:pf-rise .5s ease-out both}
@keyframes pf-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.pf-xp-fill{position:relative;overflow:hidden}
.pf-xp-fill::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);transform:translateX(-100%);animation:pf-xp-shimmer 2.4s ease-in-out infinite}
@keyframes pf-xp-shimmer{to{transform:translateX(100%)}}
.pf-flame{animation:pf-flame 1.6s ease-in-out infinite}
@keyframes pf-flame{0%,100%{transform:scale(1) rotate(0deg)}50%{transform:scale(1.18) rotate(-6deg)}}
.pf-node-current{animation:pf-node 2s ease-out infinite}
@keyframes pf-node{0%{box-shadow:0 0 0 0 color-mix(in srgb, var(--primary) 55%, transparent)}100%{box-shadow:0 0 0 12px transparent}}
.pf-float{animation:pf-float 3.4s ease-in-out infinite}
@keyframes pf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
`

const seeded = (index: number, salt: number) => {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

const CANDLES = Array.from({ length: 24 }, (_, i) => {
  const base = 110 + Math.sin(i * 0.6) * 45
  const open = base + (seeded(i, 1) - 0.5) * 40
  const close = base + (seeded(i, 2) - 0.5) * 40
  return {
    x: 25 + i * 50,
    open,
    close,
    high: Math.min(open, close) - seeded(i, 3) * 22,
    low: Math.max(open, close) + seeded(i, 4) * 22,
  }
})

const STARS = Array.from({ length: 46 }, (_, i) => ({
  x: seeded(i, 5) * 100,
  y: seeded(i, 6) * 100,
  size: 1.2 + seeded(i, 7) * 3,
  delay: seeded(i, 8) * 4,
}))

const WAVE_PATH = 'M0 60 C150 10 300 110 450 60 S750 10 900 60 S1200 110 1200 60 V120 H0 Z'

const CandleTile: React.FC<{ offset: number }> = ({ offset }) => (
  <g transform={`translate(${offset} 0)`}>
    {CANDLES.map((c) => {
      const up = c.close < c.open
      const color = up ? '#22c55e' : '#ef4444'
      return (
        <g key={c.x}>
          <line x1={c.x} x2={c.x} y1={c.high} y2={c.low} stroke={color} strokeOpacity="0.7" strokeWidth="2" />
          <rect
            x={c.x - 9}
            y={Math.min(c.open, c.close)}
            width="18"
            height={Math.max(Math.abs(c.open - c.close), 5)}
            rx="3"
            fill={color}
            fillOpacity="0.65"
          />
        </g>
      )
    })}
  </g>
)

const WaveSvg: React.FC<{ className: string; opacity: number }> = ({ className, opacity }) => (
  <svg className={`pf-wave ${className}`} viewBox="0 0 2400 120" preserveAspectRatio="none">
    <path d={WAVE_PATH} fill={`rgba(255,255,255,${opacity})`} />
    <path d={WAVE_PATH} transform="translate(1200 0)" fill={`rgba(255,255,255,${opacity})`} />
  </svg>
)

const BannerScene: React.FC<{ style: BannerStyle; cover?: string }> = ({ style, cover }) => {
  if (style === 'cover') {
    if (cover) {
      return <div className="pf-cover" style={{ backgroundImage: `url(${cover})` }} />
    }
    return (
      <>
        <div className="pf-layer pf-gradient" />
        <div className="pf-blob pf-blob-c" />
      </>
    )
  }

  if (style === 'candles') {
    return (
      <>
        <div className="pf-layer pf-night-base" />
        <div className="pf-layer pf-grid" style={{ opacity: 0.18 }} />
        <div className="pf-blob pf-blob-a" style={{ opacity: 0.35 }} />
        <svg className="pf-scroll" viewBox="0 0 2400 200" preserveAspectRatio="none">
          <CandleTile offset={0} />
          <CandleTile offset={1200} />
        </svg>
      </>
    )
  }

  if (style === 'grid') {
    return (
      <>
        <div className="pf-layer pf-gradient" />
        <div className="pf-layer pf-grid" />
        <div className="pf-blob pf-blob-c" />
      </>
    )
  }

  if (style === 'waves') {
    return (
      <>
        <div className="pf-layer pf-gradient" />
        <WaveSvg className="pf-wave-1" opacity={0.22} />
        <WaveSvg className="pf-wave-2" opacity={0.2} />
        <WaveSvg className="pf-wave-3" opacity={0.28} />
      </>
    )
  }

  if (style === 'stars') {
    return (
      <>
        <div className="pf-layer pf-night-base" />
        <div className="pf-blob pf-blob-a" style={{ opacity: 0.4 }} />
        <div className="pf-blob pf-blob-b" style={{ opacity: 0.4 }} />
        {STARS.map((star, index) => (
          <span
            key={index}
            className="pf-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
        <span className="pf-meteor" />
      </>
    )
  }

  return (
    <>
      <div className="pf-layer pf-aurora-base" />
      <div className="pf-blob pf-blob-a" />
      <div className="pf-blob pf-blob-b" />
      <div className="pf-blob pf-blob-c" />
    </>
  )
}

interface ProfileBannerProps {
  style: BannerStyle
  colorA: string
  colorB: string
  speed: number
  cover?: string
  className?: string
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  style,
  colorA,
  colorB,
  speed,
  cover,
  className = '',
}) => {
  const variables = { '--pf-a': colorA, '--pf-b': colorB, '--pf-speed': speed } as React.CSSProperties

  return (
    <div className={`pf-banner ${className}`} style={variables} aria-hidden="true">
      <BannerScene style={style} cover={cover} />
      <div className="pf-shine" />
    </div>
  )
}

const HEXAGON = 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)'

export const getShapeStyle = (shape: AvatarShape): React.CSSProperties => {
  if (shape === 'circle') return { borderRadius: '9999px' }
  if (shape === 'rounded') return { borderRadius: '26%' }
  return { clipPath: HEXAGON }
}

interface AvatarFrameProps {
  src?: string
  initials: string
  alt: string
  shape: AvatarShape
  frame: FrameStyle
  frameColor: string
  showLevelRing: boolean
  progress: number
  level: number
  size?: number
}

export const AvatarFrame: React.FC<AvatarFrameProps> = ({
  src,
  initials,
  alt,
  shape,
  frame,
  frameColor,
  showLevelRing,
  progress,
  level,
  size = 112,
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const outer = size + 28
  const radius = outer / 2 - 4
  const circumference = 2 * Math.PI * radius
  const shownProgress = mounted ? progress : 0
  const frameBox = size + 12
  const wrapperStyle = { width: outer, height: outer, '--pf-frame': frameColor } as React.CSSProperties
  const shapeStyle = getShapeStyle(shape)

  return (
    <div className="relative flex items-center justify-center" style={wrapperStyle}>
      {showLevelRing && (
        <svg
          className="absolute inset-0 -rotate-90"
          width={outer}
          height={outer}
          viewBox={`0 0 ${outer} ${outer}`}
        >
          <circle cx={outer / 2} cy={outer / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth="5" />
          <circle
            className="pf-ring-progress"
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            fill="none"
            stroke="var(--pf-frame)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - shownProgress / 100)}
          />
        </svg>
      )}

      {frame !== 'none' && (
        <div className={`absolute ${frame === 'pulse' ? 'pf-frame-pulse' : ''}`} style={{ width: frameBox, height: frameBox }}>
          <div
            className={`w-full h-full ${frame === 'rainbow' ? 'pf-frame-rainbow' : ''}`}
            style={{ ...shapeStyle, background: frame === 'rainbow' ? undefined : 'var(--pf-frame)' }}
          />
        </div>
      )}

      {frame === 'orbit' && (
        <div className="pf-orbit" style={{ width: frameBox + 16, height: frameBox + 16 }}>
          <span />
        </div>
      )}

      <div
        className="relative overflow-hidden flex items-center justify-center font-bold text-3xl text-[var(--text)]"
        style={{ width: size, height: size, background: 'var(--surface)', ...shapeStyle }}
      >
        {src ? <img src={src} alt={alt} className="w-full h-full object-cover" /> : initials}
      </div>

      <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[var(--primary)] text-white border-2 border-[var(--surface)] flex items-center justify-center text-xs font-bold shadow">
        {level}
      </div>
    </div>
  )
}

interface TiltCardProps {
  enabled: boolean
  className?: string
  children: React.ReactNode
}

export const TiltCard: React.FC<TiltCardProps> = ({ enabled, className = '', children }) => {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!enabled || !el) return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    el.style.transform = `perspective(700px) rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 12}deg)`
    el.style.setProperty('--pf-gx', `${px * 100}%`)
    el.style.setProperty('--pf-gy', `${py * 100}%`)
  }

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`${enabled ? 'pf-tilt' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export const useCountUp = (target: number, duration = 900) => {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}

export const CountUp: React.FC<{ value: number }> = ({ value }) => <>{useCountUp(value)}</>

const WEEKDAY_LABELS = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

export const StreakCalendar: React.FC<{ streak: number }> = ({ streak }) => {
  const totalDays = 28
  const today = new Date()

  const cells = Array.from({ length: totalDays }, (_, index) => {
    const daysAgo = totalDays - 1 - index
    const date = new Date(today)
    date.setDate(today.getDate() - daysAgo)
    return { index, daysAgo, date, active: daysAgo < streak }
  })

  const startWeekday = cells[0].date.getDay()
  const headers = Array.from({ length: 7 }, (_, i) => WEEKDAY_LABELS[(startWeekday + i) % 7])

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-mono text-[var(--text-muted)]">
        {headers.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((cell) => {
          const isToday = cell.daysAgo === 0
          return (
            <div
              key={cell.index}
              title={cell.date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
              className={`aspect-square rounded-md flex items-center justify-center text-[10px] border transition-transform hover:scale-110 ${
                cell.active
                  ? 'border-transparent text-white'
                  : 'border-[var(--border)] bg-[var(--bg-alt)] text-[var(--text-muted)]'
              }`}
              style={
                cell.active
                  ? { background: 'linear-gradient(135deg, #f97316, #ef4444)', outline: isToday ? '2px solid var(--primary)' : undefined, outlineOffset: 2 }
                  : { outline: isToday ? '2px solid var(--primary)' : undefined, outlineOffset: 2 }
              }
            >
              {cell.active ? (
                <i className={`fa-solid fa-fire ${isToday ? 'pf-flame' : ''}`}></i>
              ) : (
                cell.date.getDate()
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface LevelJourneyProps {
  level: number
  xp: number
  xpToNext: number
}

export const LevelJourney: React.FC<LevelJourneyProps> = ({ level, xp, xpToNext }) => {
  const nodeCount = 5
  const start = Math.max(1, level - 1)
  const nodes = Array.from({ length: nodeCount }, (_, i) => start + i)
  const currentIndex = level - start
  const fraction = xpToNext > 0 ? Math.min(1, xp / xpToNext) : 0
  const fillPercent = Math.min(100, ((currentIndex + fraction) / (nodeCount - 1)) * 100)
  const missing = Math.max(0, xpToNext - xp)

  return (
    <div className="space-y-4">
      <div className="relative px-4 pt-1">
        <div className="absolute left-8 right-8 top-[19px] h-1 rounded-full bg-[var(--border)]" />
        <div
          className="absolute left-8 top-[19px] h-1 rounded-full bg-[var(--primary)] transition-all duration-1000"
          style={{ width: `calc((100% - 4rem) * ${fillPercent / 100})` }}
        />
        <div className="relative flex justify-between">
          {nodes.map((node) => {
            const done = node < level
            const current = node === level
            return (
              <div key={node} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                    current
                      ? 'pf-node-current bg-[var(--primary)] border-[var(--primary)] text-white'
                      : done
                        ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]'
                  }`}
                >
                  {done ? (
                    <i className="fa-solid fa-check text-xs"></i>
                  ) : current ? (
                    node
                  ) : (
                    <i className="fa-solid fa-lock text-[10px]"></i>
                  )}
                </div>
                <span className={`text-[11px] ${current ? 'font-bold text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>
                  Nivel {node}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      {xpToNext > 0 && (
        <p className="text-center text-xs text-[var(--text-muted)]">
          Te faltan <span className="font-bold text-[var(--text)]">{missing} XP</span> para llegar al nivel {level + 1}.
        </p>
      )}
    </div>
  )
}
