import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { CATEGORIES, COURSE_STAGES, MODULES_BY_CATEGORY } from '../data/catalog'

const RESOURCE_NAMES: Record<string, string[]> = {
  trading: ['Análisis de mercado', 'Plan de operación', 'Simulador'],
  gaming: ['Ficha de mecánicas', 'Análisis de una economía digital', 'Diseña tu videojuego'],
  cine: ['Ficha de una escena', 'Análisis de un personaje', 'Escribe una secuencia'],
  libros: ['Ficha de lectura', 'Análisis de un narrador', 'Escribe un relato'],
  musica: ['Diario de escucha', 'Análisis de una canción', 'Plan de producción'],
  historia: ['Línea del tiempo', 'Análisis de causas y consecuencias', 'Compara fuentes'],
  ciencia: ['Cuaderno de observación', 'Diseña un experimento', 'Evalúa una hipótesis'],
  cultura: ['Mapa de ideas', 'Compara perspectivas', 'Construye un argumento'],
}

export const LearningSidebar: React.FC<{ categoryId: string }> = ({ categoryId }) => {
  const { user } = usePlatform()
  const [activeResource, setActiveResource] = useState<number | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const category = CATEGORIES.find((item) => item.id === categoryId) || CATEGORIES[0]
  const modules = MODULES_BY_CATEGORY[category.id] || []
  const completed = new Set((user.moduleProgress[category.id] || []).filter((index) => Number.isInteger(index) && index >= 0 && index < modules.length))
  const progress = modules.length ? Math.round(completed.size / modules.length * 100) : 0
  const stages = Math.ceil(modules.length / 4)
  const completedStages = Array.from({ length: stages }, (_, stage) => modules.slice(stage * 4, stage * 4 + 4).every((_, index) => completed.has(stage * 4 + index))).filter(Boolean).length
  const nextLesson = modules.findIndex((_, index) => !completed.has(index))
  const thresholds = [Math.min(4, modules.length), Math.min(8, modules.length), modules.length]
  const resourceNames = RESOURCE_NAMES[category.id]

  return <aside className="lm-map-sidebar">
    <section className="lm-side-card">
      <span className="lm-eyebrow">Tu progreso</span>
      <h3>{category.name}</h3>
      <strong className="lm-xp-total">{progress}% del camino</strong>
      <div className="lm-xp-bar" role="progressbar" aria-label={`Progreso de ${category.name}`} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div>
      <p>{completed.size} de {modules.length} lecciones · {completedStages} de {stages} etapas</p>
      <small>{nextLesson < 0 ? 'Camino completado. Puedes repasar tus lecciones.' : `Siguiente: ${modules[nextLesson]}`}</small>
      {nextLesson >= 0 && <small>Etapa: {COURSE_STAGES[category.id]?.[Math.floor(nextLesson / 4)]}</small>}
      <div className="lm-badges"><span><i className="fa-solid fa-bolt" /> {user.xp} XP totales</span><span>Nivel {user.level}</span><span>Racha de {user.streak} días</span></div>
    </section>
    <section className="lm-side-card">
      <span className="lm-eyebrow">Aprende y desbloquea</span>
      <h3>Recursos para practicar {category.name}</h3>
      {resourceNames.map((name, index) => {
        const unlocked = completed.size >= thresholds[index] && modules.length > 0
        const expanded = activeResource === index && unlocked
        const noteKey = `${category.id}-${index}`
        return <div key={name}>
          <button type="button" className="lm-unlock lm-resource-button" disabled={!unlocked} aria-expanded={expanded} onClick={() => setActiveResource(expanded ? null : index)}>
            <i className={['fa-solid fa-book-open', 'fa-solid fa-pencil', 'fa-solid fa-flask'][index]} />
            <span><strong>{name}</strong><small>{unlocked ? 'Desbloqueado · Abrir recurso' : `Completa ${thresholds[index]} lecciones (${completed.size}/${thresholds[index]})`}</small></span>
            <i className={unlocked ? 'fa-solid fa-lock-open' : 'fa-solid fa-lock'} />
          </button>
          {expanded && <div className="lm-resource-content">
            <strong>{name}</strong>
            <p>{['Elige un ejemplo y describe cómo se relaciona con los conceptos de las primeras lecciones.', 'Analiza un caso: identifica sus elementos, explica sus relaciones y justifica tus conclusiones.', 'Crea una propuesta usando lo aprendido. Explica sus pasos y cómo comprobarías el resultado.'][index]}</p>
            <small>Conceptos de apoyo: {modules.slice(index === 0 ? 0 : Math.max(0, thresholds[index] - 4), thresholds[index]).join(' · ')}</small>
            <label htmlFor={`resource-${category.id}-${index}`}>Tus notas de práctica</label>
            <textarea id={`resource-${category.id}-${index}`} className="platform-input" rows={5} value={notes[noteKey] || ''} onChange={(event) => setNotes((previous) => ({ ...previous, [noteKey]: event.target.value }))} placeholder="Escribe tus observaciones y conclusiones" />
            <small>Las notas se conservan mientras permaneces en este camino.</small>
            {category.id === 'trading' && <Link to={index === 2 ? '/simulador' : '/analisis'}>Abrir {index === 2 ? 'simulador' : 'análisis'} <i className="fa-solid fa-arrow-right" /></Link>}
          </div>}
        </div>
      })}
    </section>
    <section className="lm-side-card lm-mentor-card">
      <i className="fa-solid fa-wand-magic-sparkles" /><strong>Mentor IA de {category.name}</strong>
      <p>Consulta tus dudas y repasa los conceptos de este camino con el Mentor.</p>
      <Link to={`/mentor?cat=${category.id}`}>Preguntar al Mentor <i className="fa-solid fa-arrow-right" /></Link>
    </section>
  </aside>
}
