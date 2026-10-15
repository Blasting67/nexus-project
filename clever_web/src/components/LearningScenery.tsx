import React, { useEffect, useRef, useState } from 'react'

const SCENERY: Record<string, { icons: string[]; finale: string; title: string; caption: string }> = {
  trading: { icons: ['chart-line', 'money-bill-wave', 'chart-column', 'coins'], finale: 'vault', title: 'La bóveda del mercado', caption: 'El destino de tu recorrido financiero' },
  gaming: { icons: ['gamepad', 'ghost', 'heart', 'floppy-disk'], finale: 'ghost', title: 'El jefe final', caption: 'La última pantalla de tu aventura' },
  cine: { icons: ['film', 'clapperboard', 'ticket', 'video'], finale: 'trophy', title: 'La gran premiere', caption: 'Tu lugar al otro lado de la cámara' },
  libros: { icons: ['book-open', 'feather-pointed', 'bookmark', 'scroll'], finale: 'book-open', title: 'Tu propia biblioteca', caption: 'Cada historia abre una nueva puerta' },
  musica: { icons: ['music', 'headphones', 'compact-disc', 'guitar'], finale: 'microphone-lines', title: 'El escenario principal', caption: 'Todo el recorrido en una gran composición' },
  historia: { icons: ['landmark', 'scroll', 'chess-rook', 'compass'], finale: 'landmark', title: 'El archivo de las civilizaciones', caption: 'Un recorrido que conecta pasado y presente' },
  ciencia: { icons: ['atom', 'flask', 'microscope', 'satellite'], finale: 'rocket', title: 'La próxima frontera', caption: 'Tus ideas listas para despegar' },
  cultura: { icons: ['earth-americas', 'palette', 'masks-theater', 'chess-knight'], finale: 'earth-americas', title: 'Un mundo de conexiones', caption: 'Ideas que se encuentran al final del camino' },
}

export const LearningParticles: React.FC = () => <div className="lm-particles" aria-hidden="true">
  {Array.from({ length: 24 }, (_, index) => <span key={index} style={{
    left: `${(index * 43 + 7) % 100}%`,
    top: `${(index * 29 + 3) % 100}%`,
    '--particle-delay': `${-(index % 9) * 2}s`,
    '--particle-duration': `${14 + index % 7 * 2}s`,
    '--particle-size': `${2 + index % 3}px`,
  } as React.CSSProperties} />)}
</div>

export const LearningScenery: React.FC<{ categoryId: string; stage: number }> = ({ categoryId, stage }) => {
  const scenery = SCENERY[categoryId] || SCENERY.trading
  return <div className={`lm-scenery lm-scenery-${categoryId}`} aria-hidden="true">
    <LearningParticles />
    {scenery.icons.map((icon, index) => <span className={`lm-scenery-object lm-scenery-object-${index}`} key={icon}>
      <i className={`fa-solid fa-${scenery.icons[(index + stage) % scenery.icons.length]}`} />
      {categoryId === 'trading' && index === 0 && <span className="lm-mini-candles">{[24, 38, 19, 45, 31].map((height, candle) => <b key={candle} style={{ height }} />)}</span>}
      {categoryId === 'musica' && index === 2 && <span className="lm-mini-equalizer">{[12, 28, 40, 20, 34, 16].map((height, bar) => <b key={bar} style={{ height }} />)}</span>}
    </span>)}
  </div>
}

export const LearningFinale: React.FC<{ categoryId: string }> = ({ categoryId }) => {
  const scenery = SCENERY[categoryId] || SCENERY.trading
  const sectionRef = useRef<HTMLElement>(null)
  const [arrived, setArrived] = useState(false)
  useEffect(() => {
    const element = sectionRef.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      setArrived(entry.isIntersecting)
    }, { threshold: 0.35 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [categoryId])
  return <section ref={sectionRef} className={`lm-finale lm-finale-${categoryId}${arrived ? ' lm-finale-arrived' : ''}`} aria-label={`Final del camino: ${scenery.title}`}>
    <div className="lm-finale-burst" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index} style={{ '--burst-angle': `${index * 30}deg`, '--burst-distance': `${85 + index % 3 * 22}px` } as React.CSSProperties} />)}</div>
    <div className="lm-finale-connector" aria-hidden="true" />
    <div className="lm-finale-scene" aria-hidden="true">
      <span className="lm-finale-prop prop-left"><i className={`fa-solid fa-${scenery.icons[0]}`} /></span>
      <div className="lm-finale-emblem">
        {categoryId === 'gaming' ? <div className="lm-pixel-boss"><span /><span /><b /></div> : <i className={`fa-solid fa-${scenery.finale}`} />}
        {categoryId === 'trading' && <span className="lm-vault-money"><i className="fa-solid fa-money-bill-wave" /><i className="fa-solid fa-coins" /></span>}
      </div>
      <span className="lm-finale-prop prop-right"><i className={`fa-solid fa-${scenery.icons[2]}`} /></span>
      <span className="lm-finale-plinth" />
    </div>
    <span className="lm-eyebrow">Final del camino</span>
    <h3>{scenery.title}</h3>
    <p>{scenery.caption}</p>
  </section>
}
