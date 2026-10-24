import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { MODULES_BY_CATEGORY } from '../data/catalog'
import { GuestSignupGate } from '../components/GuestSignupGate'
import { TradingTrailMap, type TrailLessonStatus, type TrailScene } from '../components/learn/TradingTrailMap'
import { useProfileCustomization } from '../services/profileCustomizationService'
import { Microtext, NOTE_STYLES, ROSETTE_SMALL, Rosette, SmallRosette } from '../components/note/NoteKit'

const COURSE_ID = 'trading'
const COURSE_NAME = 'Trading y Finanzas'
const LESSONS_PER_STAGE = 4
const TRADING_MODULES: string[] = MODULES_BY_CATEGORY.trading

const STAGES = [
  {
    title: 'Leer el mercado',
    objective: 'Entiende cómo funciona un mercado, lee velas japonesas, reconoce soportes y tendencias y aprende a cuidar tu riesgo.',
  },
  {
    title: 'Operar con disciplina',
    objective: 'Controla tus emociones, usa órdenes y estrategias, practica en el simulador y pon a prueba tus ideas con datos históricos.',
  },
]

const LESSON_SCENES: TrailScene[] = ['company', 'candles', 'range', 'stoploss', 'emotions', 'orders', 'simulator', 'backtest']

const WORLD_PHRASES: Record<string, string> = { city: 'la ciudad', candles: 'el Valle de las velas', island: 'la Isla del tesoro' }

const LESSONS = TRADING_MODULES.map((title, index) => ({
  title,
  stageIndex: Math.floor(index / LESSONS_PER_STAGE),
  scene: LESSON_SCENES[index % LESSON_SCENES.length],
}))

const LESSON_COPY = {
  idea: 'Este concepto te ayuda a interpretar los movimientos del mercado y tomar decisiones con un plan.',
  simple: 'Imagina que {term} es una pieza de un mapa que te ayuda a orientarte antes de dar el siguiente paso.',
  example: 'Al revisar una gráfica de precios, puedes reconocer {term} y explicar qué información aporta.',
  practice: 'Mira una gráfica sencilla e intenta encontrar un ejemplo de {term}. ¿Qué observas?',
}

const QUESTIONS = [
  { title: '¿Qué es una stablecoin?', answers: ['Una criptomoneda diseñada para mantener un valor estable', 'Una moneda que siempre sube', 'Una acción de una empresa'] },
  { title: '¿Has utilizado alguna vez una plataforma de trading?', answers: ['Sí, varias veces', 'La he explorado, pero no operado', 'Todavía no'] },
  { title: '¿Has visto una vela japonesa?', answers: ['Sí, y sé qué muestra', 'La he visto, pero no la entiendo aún', 'No, todavía no'] },
]

const STYLES = [
  { icon: 'fa-solid fa-seedling', title: 'Explícamelo fácil', text: 'Ejemplos cotidianos y palabras sencillas.' },
  { icon: 'fa-solid fa-book-open', title: 'Quiero aprender en detalle', text: 'Conceptos y términos de los mercados.' },
  { icon: 'fa-solid fa-wand-magic-sparkles', title: 'Quiero aprender haciendo', text: 'Gráficas y ejercicios prácticos.' },
  { icon: 'fa-solid fa-forward', title: 'Ya tengo experiencia', text: 'Avanza y repasa solo lo que necesitas.' },
]

const RESOURCES = [
  {
    icon: 'fa-solid fa-magnifying-glass-chart',
    name: 'Análisis de mercado',
    threshold: 4,
    prompt: 'Elige un ejemplo y describe cómo se relaciona con los conceptos de las primeras lecciones.',
    link: { to: '/analisis', label: 'Abrir análisis' },
  },
  {
    icon: 'fa-solid fa-clipboard-list',
    name: 'Plan de operación',
    threshold: 8,
    prompt: 'Analiza un caso: identifica sus elementos, explica sus relaciones y justifica tus conclusiones.',
    link: { to: '/analisis', label: 'Abrir análisis' },
  },
  {
    icon: 'fa-solid fa-flask',
    name: 'Simulador',
    threshold: 8,
    prompt: 'Crea una propuesta usando lo aprendido. Explica sus pasos y cómo comprobarías el resultado.',
    link: { to: '/exchange', label: 'Abrir simulador' },
  },
]

const SURVEY_NEXT_STEPS = ['Repasarlo', 'Aplicarlo en un ejemplo', 'Continuar con el siguiente tema']
const CANDLE_HEIGHTS = [42, 65, 52, 75, 56, 82, 62, 91, 68, 78, 54, 70]
const FALLING_CANDLES = new Set([2, 6, 10])

type View = 'path' | 'style' | 'diagnostic' | 'result' | 'lesson'
type LessonStatus = TrailLessonStatus

const pad = (value: number) => String(value).padStart(2, '0')


const ProgressSeal: React.FC<{ done: number; total: number }> = ({ done, total }) => {
  const radius = 64
  const circumference = 2 * Math.PI * radius
  const ratio = total ? done / total : 0
  return (
    <div className="relative h-52 w-52 shrink-0" role="img" aria-label={`${done} de ${total} lecciones completadas`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d={ROSETTE_SMALL} fill="none" stroke="var(--ink)" strokeWidth="0.35" strokeOpacity="0.55" />
      </svg>
      <svg viewBox="0 0 160 160" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="80" cy="80" r={radius} fill="var(--surface)" stroke="var(--paper-2)" strokeWidth="7" />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${circumference * ratio} ${circumference}`}
          className="transition-[stroke-dasharray] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="note-display note-num text-5xl font-black leading-none text-[var(--text)]">
          {pad(done)}
          <span className="text-2xl text-[var(--text-muted)]">/{pad(total)}</span>
        </span>
        <span className="mt-1 text-sm text-[var(--text-muted)]">lecciones</span>
      </div>
    </div>
  )
}

const FlowShell: React.FC<{ onBack: () => void; children: React.ReactNode }> = ({ onBack, children }) => (
  <div className="note-home mx-auto max-w-3xl py-6">
    <style>{NOTE_STYLES}</style>
    <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition-colors hover:text-[var(--ink)]">
      <i className="fa-solid fa-arrow-left text-xs"></i>
      Volver al camino
    </button>
    <section className="note-paper relative isolate overflow-hidden rounded-[28px] p-7 sm:p-10">
      <SmallRosette className="pointer-events-none absolute -right-14 -top-14 -z-10 h-56 w-56 opacity-50" />
      {children}
    </section>
  </div>
)

const RewardModal: React.FC<{ reward: { title: string; bonus: number; coins: number }; onClose: () => void }> = ({ reward, onClose }) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(5,10,20,0.55)] p-4 backdrop-blur-[3px]" role="presentation" onClick={onClose}>
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="learn-reward-title"
      onClick={(event) => event.stopPropagation()}
      className="note-paper relative isolate w-full max-w-md overflow-hidden rounded-[28px] bg-[var(--bg-alt)] p-8 text-center"
    >
      <Rosette className="pointer-events-none absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/3 opacity-70" />
      <button type="button" onClick={onClose} aria-label="Cerrar recompensa" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--paper-2)]">
        <i className="fa-solid fa-xmark"></i>
      </button>
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ink)] text-2xl text-[var(--bg)]">
        <i className="fa-solid fa-award"></i>
      </span>
      <h2 id="learn-reward-title" className="note-display mt-5 text-3xl font-black text-[var(--text)]">Etapa completada</h2>
      <p className="mt-2 text-base leading-relaxed text-[var(--text-muted)]">Terminaste "{reward.title}". Tu constancia merece una recompensa.</p>
      <div className="note-display note-num mt-5 inline-flex items-center gap-3 rounded-full border-[1.5px] border-[var(--ink)] px-5 py-2 text-lg font-extrabold text-[var(--ink)]">
        +{reward.bonus} XP &middot; +{reward.coins} monedas
      </div>
      <div className="mt-7">
        <button type="button" onClick={onClose} className="note-btn note-btn-ink w-full">
          Seguir aprendiendo
          <i className="fa-solid fa-arrow-right text-sm"></i>
        </button>
      </div>
    </section>
  </div>
)

export const LearnPage: React.FC = () => {
  const { user, isGuest, completeModule, addXP, addCoins, logActivity, showToast, updateUserProfile } = usePlatform()
  const [customization, updateCustomization] = useProfileCustomization(user.username)
  const [previewEnd, setPreviewEnd] = useState(false)
  const isAdminView = !isGuest && customization.adminMode
  const showEnd = isAdminView && previewEnd
  const [searchParams, setSearchParams] = useSearchParams()

  const [isGuestGateOpen, setIsGuestGateOpen] = useState(isGuest)
  const [learningStyle, setLearningStyle] = useState(user.learningStyle || '')
  const [question, setQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showEasy, setShowEasy] = useState(false)
  const [unitReward, setUnitReward] = useState<{ title: string; bonus: number; coins: number } | null>(null)
  const [surveyClarity, setSurveyClarity] = useState<number | null>(null)
  const [surveyNextStep, setSurveyNextStep] = useState('')
  const [activeResource, setActiveResource] = useState<number | null>(null)
  const [notes, setNotes] = useState<Record<number, string>>({})

  const requestedView = searchParams.get('view')
  const requestedLesson = Number.parseInt(searchParams.get('nivel') || '1', 10)
  const lesson = Number.isFinite(requestedLesson) ? Math.min(Math.max(requestedLesson - 1, 0), LESSONS.length - 1) : 0
  const view: View =
    requestedView === 'lesson' && !isGuest
      ? 'lesson'
      : requestedView === 'diagnostic' || requestedView === 'style'
        ? requestedView
        : requestedView === 'result' && answers.length === QUESTIONS.length
          ? 'result'
          : requestedView === 'result'
            ? 'diagnostic'
            : 'path'

  const goTo = (next: View, options: { lessonIndex?: number; replace?: boolean } = {}) => {
    const params: Record<string, string> = {}
    if (next !== 'path') params.view = next
    if (next === 'lesson') params.nivel = String((options.lessonIndex ?? 0) + 1)
    setSearchParams(params, { replace: options.replace ?? false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (view !== 'lesson') return
    setShowEasy(false)
    const savedSurvey = user.lessonSurveys?.[COURSE_ID]?.[lesson]
    setSurveyClarity(savedSurvey?.clarity ?? null)
    setSurveyNextStep(savedSurvey?.nextStep ?? '')
  }, [view, lesson])

  const completed = (user.moduleProgress[COURSE_ID] || []).filter((index) => Number.isInteger(index) && index >= 0 && index < LESSONS.length)
  const completedSet = new Set(completed)
  const totalLessons = LESSONS.length
  const progress = Math.round((completedSet.size / totalLessons) * 100)
  const firstIncomplete = LESSONS.findIndex((_, index) => !completedSet.has(index))
  const resumeIndex = firstIncomplete < 0 ? totalLessons - 1 : firstIncomplete
  const isCourseDone = firstIncomplete < 0
  const completedStages = STAGES.filter((_, stageIndex) =>
    LESSONS.every((item, index) => item.stageIndex !== stageIndex || completedSet.has(index)),
  ).length

  const statusOf = (index: number): LessonStatus => {
    if (completedSet.has(index)) return 'completed'
    if (index === resumeIndex) return 'current'
    if (index === resumeIndex + 1) return 'available'
    return 'locked'
  }

  const openPath = (replace = false) => goTo('path', { replace })

  function openLesson(index: number) {
    if (isGuest) {
      setIsGuestGateOpen(true)
      return
    }
    goTo('lesson', { lessonIndex: index })
  }

  function completeCurrentLesson() {
    const finished = user.moduleProgress[COURSE_ID] || []
    if (finished.includes(lesson)) {
      openPath(true)
      return
    }
    completeModule(COURSE_ID, lesson)
    logActivity(`Lección completada: ${TRADING_MODULES[lesson]}`)
    const stageIndex = Math.floor(lesson / LESSONS_PER_STAGE)
    const stageStart = stageIndex * LESSONS_PER_STAGE
    const stageCompleted = Array.from({ length: LESSONS_PER_STAGE }, (_, offset) => stageStart + offset)
      .filter((index) => index < totalLessons)
      .every((index) => finished.includes(index) || index === lesson)
    if (stageCompleted) {
      addXP(100)
      addCoins(50)
      setUnitReward({ title: STAGES[stageIndex]?.title || `Etapa ${stageIndex + 1}`, bonus: 100, coins: 50 })
    }
    if (stageCompleted || lesson >= totalLessons - 1) {
      openPath(true)
      return
    }
    openLesson(lesson + 1)
  }

  function submitLessonSurvey() {
    if (surveyClarity === null || !surveyNextStep) {
      showToast('Responde las dos preguntas para completar la lección y recibir tu recompensa.', 'info')
      return
    }
    const surveys = user.lessonSurveys || {}
    updateUserProfile({
      lessonSurveys: {
        ...surveys,
        [COURSE_ID]: { ...(surveys[COURSE_ID] || {}), [lesson]: { clarity: surveyClarity, nextStep: surveyNextStep, completedAt: Date.now() } },
      },
    })
    completeCurrentLesson()
  }

  const beginDiagnostic = () => {
    setQuestion(0)
    setAnswers([])
    goTo('diagnostic')
  }

  const selectAnswer = (choice: number) =>
    setAnswers((previous) => {
      const updated = [...previous]
      updated[question] = choice
      return updated
    })

  const advanceDiagnostic = () => {
    if (answers[question] === undefined) {
      showToast('Elige una respuesta para continuar.', 'info')
      return
    }
    if (question < QUESTIONS.length - 1) setQuestion((previous) => previous + 1)
    else goTo('result')
  }

  const openStyle = () => {
    setLearningStyle(user.learningStyle || '')
    goTo('style')
  }

  const saveLearningStyle = () => {
    if (!learningStyle) {
      showToast('Selecciona una forma de aprender.', 'info')
      return
    }
    updateUserProfile({ learningStyle })
    showToast('Tu forma de aprender quedó actualizada.', 'success')
    openPath(true)
  }

  if (view === 'style') {
    return (
      <FlowShell onBack={() => openPath()}>
        <h1 className="note-display text-4xl font-black leading-tight text-[var(--text)] sm:text-5xl">¿Cómo quieres aprender?</h1>
        <p className="mt-3 text-lg text-[var(--text-muted)]">Escoge lo que se sienta mejor para ti. Puedes cambiarlo después.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {STYLES.map((style) => {
            const isSelected = learningStyle === style.title
            return (
              <button
                key={style.title}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setLearningStyle(style.title)}
                className={`flex items-start gap-4 rounded-2xl border-[1.5px] p-5 text-left transition-colors ${
                  isSelected ? 'border-[var(--ink)] bg-[color-mix(in_srgb,var(--ink)_8%,var(--surface))]' : 'border-[var(--border)] bg-[var(--surface)] hover:border-[color-mix(in_srgb,var(--ink)_45%,var(--border))]'
                }`}
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${isSelected ? 'bg-[var(--ink)] text-[var(--bg)]' : 'border border-[var(--rule)] text-[var(--ink)]'}`}>
                  <i className={style.icon}></i>
                </span>
                <span>
                  <span className="note-display block text-lg font-bold text-[var(--text)]">{style.title}</span>
                  <span className="mt-1 block text-[15px] text-[var(--text-muted)]">{style.text}</span>
                </span>
              </button>
            )
          })}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-6">
          <span className="text-[15px] text-[var(--text-muted)]">
            {user.learningStyle ? `Estilo actual: ${user.learningStyle}` : 'Tu camino se adaptará a tu preferencia.'}
          </span>
          <button type="button" onClick={saveLearningStyle} className="note-btn note-btn-ink">
            Guardar preferencia
            <i className="fa-solid fa-arrow-right text-sm"></i>
          </button>
        </div>
      </FlowShell>
    )
  }

  if (view === 'diagnostic') {
    const current = QUESTIONS[question]
    return (
      <FlowShell onBack={() => openPath()}>
        <div className="flex items-center gap-4">
          <div className="grid flex-1 grid-cols-3 gap-1.5" aria-hidden="true">
            {QUESTIONS.map((item, index) => (
              <span key={item.title} className={`h-2 rounded-full ${index <= question ? 'bg-[var(--ink)]' : 'bg-[var(--paper-2)]'}`}></span>
            ))}
          </div>
          <span className="note-num text-sm font-medium text-[var(--text-muted)]">
            {question + 1} de {QUESTIONS.length}
          </span>
        </div>
        <h1 className="note-display mt-8 text-4xl font-black leading-tight text-[var(--text)] sm:text-5xl">Descubramos qué sabes</h1>
        <p className="mt-3 text-lg text-[var(--text-muted)]">No hay respuestas malas. Esto nos ayuda a sugerirte por dónde empezar.</p>
        <h2 className="note-display mt-8 text-2xl font-extrabold text-[var(--text)]">{current.title}</h2>
        <div className="mt-5 grid gap-3">
          {current.answers.map((answer, index) => {
            const isSelected = answers[question] === index
            return (
              <button
                key={answer}
                type="button"
                aria-pressed={isSelected}
                onClick={() => selectAnswer(index)}
                className={`flex items-center gap-4 rounded-2xl border-[1.5px] p-4 text-left transition-colors ${
                  isSelected ? 'border-[var(--ink)] bg-[color-mix(in_srgb,var(--ink)_8%,var(--surface))]' : 'border-[var(--border)] bg-[var(--surface)] hover:border-[color-mix(in_srgb,var(--ink)_45%,var(--border))]'
                }`}
              >
                <span className={`note-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-extrabold ${isSelected ? 'bg-[var(--ink)] text-[var(--bg)]' : 'border border-[var(--rule)] text-[var(--ink)]'}`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-base font-medium text-[var(--text)]">{answer}</span>
              </button>
            )
          })}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-6">
          <span className="text-[15px] text-[var(--text-muted)]">Responde con tranquilidad.</span>
          <button type="button" onClick={advanceDiagnostic} className="note-btn note-btn-ink">
            {question === QUESTIONS.length - 1 ? 'Ver mi recomendación' : 'Continuar'}
            <i className="fa-solid fa-arrow-right text-sm"></i>
          </button>
        </div>
      </FlowShell>
    )
  }

  if (view === 'result') {
    const isExperienced = answers[0] === 0 && answers[1] === 0
    const recommended = isExperienced ? Math.min(4, totalLessons - 1) : 0
    return (
      <FlowShell onBack={() => openPath()}>
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ink)] text-xl text-[var(--bg)]">
          <i className="fa-solid fa-compass"></i>
        </span>
        <h1 className="note-display mt-6 text-4xl font-black leading-tight text-[var(--text)] sm:text-5xl">Tu punto de partida</h1>
        <p className="note-display mt-2 text-2xl font-bold text-[var(--ink)]">{isExperienced ? 'Principiante con experiencia' : 'Principiante'}</p>
        <p className="mt-3 text-lg leading-relaxed text-[var(--text-muted)]">
          Te recomendamos avanzar a tu ritmo, construyendo una base clara antes de explorar nuevas herramientas.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-[1.5px] border-[var(--ink)] bg-[var(--surface)] p-5">
          <div>
            <span className="note-num text-sm text-[var(--text-muted)]">
              Lección {pad(recommended + 1)} &middot; Etapa {pad(LESSONS[recommended].stageIndex + 1)}
            </span>
            <strong className="note-display mt-1 block text-xl font-extrabold text-[var(--text)]">{LESSONS[recommended].title}</strong>
          </div>
          <span className="rounded-full bg-[var(--ink)] px-3 py-1 text-sm font-semibold text-[var(--bg)]">Recomendado</span>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-6">
          <span className="text-[15px] text-[var(--text-muted)]">Puedes recorrer el camino en el orden que prefieras.</span>
          <button type="button" onClick={() => openLesson(recommended)} className="note-btn note-btn-ink">
            Ir a mi lección
            <i className="fa-solid fa-arrow-right text-sm"></i>
          </button>
        </div>
        {isGuest && isGuestGateOpen && <GuestSignupGate onClose={() => setIsGuestGateOpen(false)} />}
      </FlowShell>
    )
  }

  if (view === 'lesson') {
    const title = LESSONS[lesson]?.title || LESSONS[0].title
    const stageIndex = LESSONS[lesson]?.stageIndex ?? 0
    const term = title.toLowerCase()
    const isCandle = term.includes('vela')
    const isSimpleStyle = user.learningStyle === STYLES[0].title
    const isDetailedStyle = user.learningStyle === STYLES[1].title
    const isPracticeStyle = user.learningStyle === STYLES[2].title
    const technical = isCandle
      ? 'Una vela japonesa representa cómo se movió el precio de un activo durante un periodo. Su cuerpo muestra la apertura y el cierre; las mechas señalan los precios máximo y mínimo.'
      : `${title}: ${LESSON_COPY.idea}`
    const simple = isCandle
      ? 'Piensa en una vela como el resumen de una historia: te enseña dónde empezó y terminó el precio, y hasta dónde llegó en el camino.'
      : LESSON_COPY.simple.replace('{term}', term)
    const example = isCandle
      ? 'Si una criptomoneda comenzó en $100 y terminó en $110, la vela muestra ese movimiento. Sus mechas señalan si llegó a subir o bajar más.'
      : LESSON_COPY.example.replaceAll('{term}', term)
    const practicePrompt = LESSON_COPY.practice.replace('{term}', term)
    const isLessonDone = completedSet.has(lesson)
    const isStageClosing = (lesson + 1) % LESSONS_PER_STAGE === 0

    return (
      <div className="note-home mx-auto max-w-6xl space-y-8 py-6">
        <style>{NOTE_STYLES}</style>
        <nav aria-label="Ruta" className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-muted)]">
          <button type="button" onClick={() => openPath()} className="font-semibold transition-colors hover:text-[var(--ink)]">
            Aprender
          </button>
          <i className="fa-solid fa-chevron-right text-[10px] text-[var(--text-dim)]"></i>
          <button type="button" onClick={() => openPath()} className="font-semibold transition-colors hover:text-[var(--ink)]">
            {COURSE_NAME}
          </button>
          <i className="fa-solid fa-chevron-right text-[10px] text-[var(--text-dim)]"></i>
          <span className="note-num">Lección {pad(lesson + 1)}</span>
        </nav>

        <header className="note-bill note-paper relative isolate overflow-hidden rounded-[28px] p-7 sm:p-10">
          <Rosette className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[460px] w-[460px]" />
          <div className="flex flex-wrap items-center gap-3">
            <span className="note-wide text-xs font-extrabold text-[var(--ink)]">ETAPA {pad(stageIndex + 1)} &middot; {STAGES[stageIndex]?.title.toUpperCase()}</span>
            <span className="h-px w-8 bg-[var(--rule)]"></span>
            <span className="note-num text-sm text-[var(--text-muted)]">
              Lección {pad(lesson + 1)} de {pad(totalLessons)}
            </span>
          </div>
          <h1 className="note-display mt-4 max-w-[20ch] text-4xl font-black leading-[1.02] text-[var(--text)] sm:text-[3.4rem]">{title}</h1>
          <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-[var(--text-muted)]">{technical}</p>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <div className="space-y-5">
            <section className="note-card p-6 sm:p-7">
              <h2 className="note-display text-xl font-extrabold text-[var(--text)]">{isDetailedStyle ? 'Concepto clave' : 'La idea principal'}</h2>
              <p className="mt-3 text-base leading-relaxed text-[var(--text)]">{technical}</p>
              {isDetailedStyle && (
                <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--rule)] px-3 py-1 text-sm text-[var(--ink)]">
                  <i className="fa-solid fa-bookmark text-xs"></i>
                  Término clave: {title}
                </span>
              )}
            </section>

            <section className="note-card p-6 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="note-display text-xl font-extrabold text-[var(--text)]">{isSimpleStyle ? 'En palabras simples' : 'Una forma de entenderlo'}</h2>
                <button type="button" onClick={() => setShowEasy((previous) => !previous)} className="note-btn note-btn-line !h-10 !px-4 !text-sm">
                  {showEasy ? 'Ver explicación' : 'Explicarlo más fácil'}
                </button>
              </div>
              <p className="mt-3 text-base leading-relaxed text-[var(--text)]">{showEasy || isSimpleStyle ? simple : technical}</p>
            </section>

            {isCandle && (
              <section className="note-card p-6 sm:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="note-display text-xl font-extrabold text-[var(--text)]">{isPracticeStyle ? 'Prueba a leer este movimiento' : 'Así se ve un movimiento'}</h2>
                  <small className="text-sm text-[var(--text-muted)]">Ilustración &middot; sin datos de mercado</small>
                </div>
                <svg viewBox="0 0 360 140" className="mt-5 h-40 w-full" role="img" aria-label="Ilustración de velas japonesas">
                  {[35, 70, 105].map((y) => (
                    <line key={y} x1="0" x2="360" y1={y} y2={y} stroke="var(--rule)" strokeWidth="0.8" />
                  ))}
                  {CANDLE_HEIGHTS.map((height, index) => {
                    const isFalling = FALLING_CANDLES.has(index)
                    const body = height * 0.55
                    const x = 18 + index * 28
                    const top = 128 - body - index * 1.5
                    const wick = 10 + (index % 3) * 5
                    const color = isFalling ? 'var(--ink-3)' : 'var(--ink)'
                    return (
                      <g key={index}>
                        <line x1={x} x2={x} y1={top - wick} y2={top + body + wick / 2} stroke={color} strokeWidth="1.6" />
                        <rect x={x - 7} y={top} width="14" height={body} rx="2" fill={color} fillOpacity={isFalling ? 0.75 : 0.85} />
                      </g>
                    )
                  })}
                </svg>
                <div className="mt-3 flex justify-between text-sm text-[var(--text-muted)]">
                  <span>Apertura</span>
                  <span>Movimiento del precio</span>
                  <span>Cierre</span>
                </div>
                {isPracticeStyle && <p className="mt-4 text-base font-medium text-[var(--ink)]">Observa el cuerpo y las mechas. ¿En qué dirección terminó el precio?</p>}
              </section>
            )}

            {isPracticeStyle && !isCandle && (
              <section className="note-card p-6 sm:p-7">
                <h2 className="note-display flex items-center gap-2 text-xl font-extrabold text-[var(--text)]">
                  <i className="fa-solid fa-pencil text-base text-[var(--ink)]"></i>
                  Prueba rápida
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[var(--text)]">{practicePrompt}</p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">Piensa tu respuesta antes de continuar.</p>
              </section>
            )}
          </div>

          <div className="space-y-5">
            <section className="note-paper relative isolate overflow-hidden rounded-[20px] p-6 sm:p-7">
              <SmallRosette className="pointer-events-none absolute -bottom-12 -right-12 -z-10 h-40 w-40 opacity-50" />
              <h2 className="note-display flex items-center gap-2 text-xl font-extrabold text-[var(--text)]">
                <i className="fa-regular fa-lightbulb text-base text-[var(--ink)]"></i>
                {isDetailedStyle ? 'Aplicación del concepto' : 'Ejemplo cotidiano'}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[var(--text)]">{example}</p>
            </section>
            <button type="button" onClick={openStyle} className="note-card note-link group flex w-full items-center gap-4 p-5 text-left">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--rule)] text-[var(--ink)]">
                <i className="fa-solid fa-sliders"></i>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-[var(--text-muted)]">Tu forma de aprender</span>
                <span className="note-display block text-lg font-bold text-[var(--text)]">{user.learningStyle || 'Elegir estilo'}</span>
              </span>
              <i className="fa-solid fa-arrow-right text-sm text-[var(--text-dim)] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--ink)]"></i>
            </button>
          </div>
        </div>

        <section className="note-card p-6 sm:p-9">
          <h2 className="note-display text-3xl font-black text-[var(--text)]">Antes de seguir, cuéntanos</h2>
          <p className="mt-2 text-base text-[var(--text-muted)]">Tu respuesta guarda tu avance y activa tus recompensas.</p>

          <fieldset className="mt-7">
            <legend className="note-display text-lg font-bold text-[var(--text)]">¿Qué tan clara fue esta lección?</legend>
            <div className="mt-3 grid max-w-xl grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((value) => {
                const isSelected = surveyClarity === value
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSurveyClarity(value)}
                    className={`flex flex-col items-center justify-center rounded-2xl border-[1.5px] py-3 transition-colors ${
                      isSelected ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[color-mix(in_srgb,var(--ink)_45%,var(--border))]'
                    }`}
                  >
                    <span className="note-display note-num text-xl font-extrabold">{value}</span>
                    <small className={`h-4 text-xs ${isSelected ? 'opacity-80' : 'text-[var(--text-muted)]'}`}>{value === 1 ? 'Poco' : value === 5 ? 'Mucho' : ''}</small>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset className="mt-7">
            <legend className="note-display text-lg font-bold text-[var(--text)]">¿Qué harás con lo aprendido?</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {SURVEY_NEXT_STEPS.map((choice) => {
                const isSelected = surveyNextStep === choice
                return (
                  <button
                    key={choice}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSurveyNextStep(choice)}
                    className={`rounded-full border-[1.5px] px-4 py-2 text-[15px] font-medium transition-colors ${
                      isSelected ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]' : 'border-[var(--border)] text-[var(--text)] hover:border-[color-mix(in_srgb,var(--ink)_45%,var(--border))]'
                    }`}
                  >
                    {choice}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-6">
            <span className="text-[15px] text-[var(--text-muted)]">
              Recompensa: <strong className="note-num text-[var(--ink)]">+35 XP &middot; +15 monedas</strong>
              {isStageClosing && <span className="block text-sm">Cierre de etapa: +100 XP &middot; +50 monedas</span>}
            </span>
            <button
              type="button"
              onClick={submitLessonSurvey}
              disabled={isLessonDone || surveyClarity === null || !surveyNextStep}
              className="note-btn note-btn-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLessonDone ? 'Lección completada' : 'Completar y continuar'}
              {!isLessonDone && <i className="fa-solid fa-arrow-right text-sm"></i>}
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="note-home mx-auto max-w-6xl space-y-14 py-6">
      <style>{NOTE_STYLES}</style>

      <header data-tour="learn-hero" className="note-bill note-paper note-enter relative isolate overflow-hidden rounded-[28px]">
        <Rosette className="pointer-events-none absolute -right-36 -top-44 -z-10 h-[520px] w-[520px] opacity-80" />
        <div className="absolute inset-x-6 top-4 sm:inset-x-8">
          <Microtext />
        </div>
        <div className="grid items-center gap-10 px-6 pb-10 pt-12 sm:px-10 lg:grid-cols-[1fr_auto] lg:px-14 lg:pb-12 lg:pt-14">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="note-wide text-sm font-extrabold text-[var(--ink)]">CLEVER</span>
              <span className="h-px w-10 bg-[var(--rule)]"></span>
              <span className="note-num text-sm text-[var(--text-muted)]">
                {totalLessons} lecciones &middot; {STAGES.length} etapas
              </span>
            </div>
            <h1 className="note-display mt-6 pr-16 text-[clamp(2.6rem,5vw,4.4rem)] font-black leading-[0.98] text-[var(--text)] [font-stretch:100%] sm:pr-0">{COURSE_NAME}</h1>
            <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-[var(--text-muted)]">
              Un paso a la vez. Construye una base sólida y desbloquea nuevas herramientas mientras avanzas.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => openLesson(resumeIndex)} className="note-btn note-btn-ink">
                {isCourseDone ? 'Repasar el camino' : completedSet.size ? 'Continuar aprendizaje' : 'Empezar el camino'}
                <i className="fa-solid fa-arrow-right text-sm"></i>
              </button>
              <button type="button" onClick={beginDiagnostic} className="note-btn note-btn-line">
                Descubrir mi nivel
              </button>
              <button type="button" data-tour="learn-style" onClick={openStyle} className="note-btn note-btn-line">
                <i className="fa-solid fa-sliders text-sm"></i>
                {user.learningStyle || '¿Cómo quieres aprender?'}
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <ProgressSeal done={completedSet.size} total={totalLessons} />
            <div className="text-center">
              <div className="note-display text-lg font-extrabold text-[var(--text)]">
                Nivel {user.level} &middot; {user.levelLabel}
              </div>
              <div className="note-num text-sm text-[var(--text-muted)]">
                {user.xp} XP &middot; {progress}% del camino
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-stretch">
        <main data-tour="learn-map" className="flex min-w-0 flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--rule)] pb-5">
            <div>
              <h2 className="note-display text-3xl font-black leading-tight text-[var(--text)] sm:text-4xl">Tu mapa de niveles</h2>
              <p className="mt-2 text-base text-[var(--text-muted)]">
                Recorre {WORLD_PHRASES[isGuest ? 'city' : customization.learnWorld]} nivel por nivel. Arrastra el mapa para ver todo el camino.
              </p>
            </div>
            {!isGuest && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    updateCustomization({ adminMode: !customization.adminMode })
                    setPreviewEnd(false)
                  }}
                  aria-pressed={isAdminView}
                  title={isAdminView ? 'Cambiar a usuario normal' : 'Cambiar a admin'}
                  className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[14px] font-semibold transition-colors ${
                    isAdminView ? 'border-[var(--ink-3)] bg-[var(--ink-3)] text-[var(--bg)]' : 'border-[var(--rule)] text-[var(--text-muted)] hover:bg-[var(--paper)]'
                  }`}
                >
                  <i className={`fa-solid ${isAdminView ? 'fa-user-shield' : 'fa-user'} text-[12px]`}></i>
                  {isAdminView ? 'Admin' : 'Usuario'}
                </button>
                {isAdminView && (
                  <button
                    type="button"
                    onClick={() => setPreviewEnd((value) => !value)}
                    aria-pressed={showEnd}
                    className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[14px] font-semibold transition-colors ${
                      showEnd ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]' : 'border-[var(--rule)] text-[var(--ink)] hover:bg-[var(--paper)]'
                    }`}
                  >
                    <i className={`fa-solid ${showEnd ? 'fa-rotate-left' : 'fa-flag-checkered'} text-[12px]`}></i>
                    {showEnd ? 'Ver mi progreso' : 'Ver el final'}
                  </button>
                )}
              </div>
            )}
            {!isGuest && (
              <Link to="/perfil?estudio=mundo" className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--rule)] px-4 text-[14px] font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--paper)]">
                <i className="fa-solid fa-earth-americas text-[12px]"></i>
                Cambiar mundo
              </Link>
            )}
            <span className="note-num text-sm font-semibold text-[var(--text-muted)]">
              {completedSet.size} de {totalLessons} niveles
            </span>
          </div>
          {showEnd && (
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-[var(--ink-3)] bg-[color-mix(in_srgb,var(--ink-3)_8%,transparent)] px-4 py-3 text-[14px] text-[var(--text)]">
              <i className="fa-solid fa-user-shield text-[var(--ink-3)]"></i>
              Vista de admin: el mapa muestra el curso terminado. Tu progreso real no cambia.
            </div>
          )}
          <div className="relative h-[72vh] min-h-[520px] lg:h-auto lg:flex-1">
            <div className="absolute inset-0">
              <TradingTrailMap
                key={showEnd ? 'end' : 'real'}
                lessons={LESSONS}
                stages={STAGES}
                statusOf={showEnd ? () => 'completed' : statusOf}
                onOpenLesson={openLesson}
                isCourseDone={showEnd || isCourseDone}
                completedCount={showEnd ? totalLessons : completedSet.size}
                world={isGuest ? 'city' : customization.learnWorld}
              />
            </div>
          </div>
        </main>

        <aside className="space-y-5">
          <section className="note-card p-6">
            <h2 className="note-display text-xl font-extrabold text-[var(--text)]">Tu progreso</h2>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="note-display note-num text-4xl font-black text-[var(--ink)]">{progress}%</span>
              <span className="note-num text-sm text-[var(--text-muted)]">
                {completedSet.size} de {totalLessons} lecciones
              </span>
            </div>
            <div className="mt-3 grid grid-cols-8 gap-1" aria-hidden="true">
              {LESSONS.map((item, index) => (
                <span key={item.title} className={`h-2 rounded-full ${completedSet.has(index) ? 'bg-[var(--ink)]' : 'bg-[var(--paper-2)]'}`}></span>
              ))}
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-muted)]">
              {isCourseDone ? 'Camino completado. Puedes repasar tus lecciones.' : `Siguiente: ${LESSONS[resumeIndex].title}`}
            </p>
            <div className="mt-4 grid grid-cols-3 divide-x divide-[var(--rule)] rounded-2xl border border-[var(--rule)]">
              {[
                { value: user.xp, label: 'XP' },
                { value: user.level, label: 'Nivel' },
                { value: completedStages, label: 'Etapas' },
              ].map((stat) => (
                <div key={stat.label} className="py-2.5 text-center">
                  <div className="note-display note-num text-lg font-extrabold text-[var(--text)]">{stat.value}</div>
                  <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <i className="fa-solid fa-fire text-[var(--ink-3)]"></i>
              Racha de {user.streak} días
            </p>
          </section>

          <section className="note-card p-6">
            <h2 className="note-display text-xl font-extrabold text-[var(--text)]">Recursos para practicar</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Se desbloquean conforme completas lecciones.</p>
            <div className="mt-4 space-y-2">
              {RESOURCES.map((resource, index) => {
                const threshold = Math.min(resource.threshold, totalLessons)
                const isUnlocked = completedSet.size >= threshold
                const isExpanded = activeResource === index && isUnlocked
                return (
                  <div key={resource.name} className={`overflow-hidden rounded-2xl border ${isExpanded ? 'border-[var(--ink)]' : 'border-[var(--rule)]'}`}>
                    <button
                      type="button"
                      disabled={!isUnlocked}
                      aria-expanded={isExpanded}
                      onClick={() => setActiveResource(isExpanded ? null : index)}
                      className="flex w-full items-center gap-3 p-3.5 text-left disabled:cursor-not-allowed"
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isUnlocked ? 'bg-[var(--ink)] text-[var(--bg)]' : 'bg-[var(--bg-alt)] text-[var(--text-dim)]'}`}>
                        <i className={resource.icon}></i>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-[15px] font-semibold ${isUnlocked ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>{resource.name}</span>
                        <span className="note-num block text-xs text-[var(--text-muted)]">
                          {isUnlocked ? 'Desbloqueado · Abrir recurso' : `Completa ${threshold} lecciones (${completedSet.size}/${threshold})`}
                        </span>
                      </span>
                      <i className={`text-xs ${isUnlocked ? 'fa-solid fa-chevron-down text-[var(--ink)]' : 'fa-solid fa-lock text-[var(--text-dim)]'} ${isExpanded ? 'rotate-180' : ''} transition-transform`}></i>
                    </button>
                    {isExpanded && (
                      <div className="space-y-3 border-t border-[var(--rule)] p-4">
                        <p className="text-[15px] leading-relaxed text-[var(--text)]">{resource.prompt}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          Conceptos de apoyo: {TRADING_MODULES.slice(Math.max(0, threshold - LESSONS_PER_STAGE), threshold).join(' · ')}
                        </p>
                        <label htmlFor={`learn-resource-${index}`} className="block text-sm font-semibold text-[var(--text)]">
                          Tus notas de práctica
                        </label>
                        <textarea
                          id={`learn-resource-${index}`}
                          className="platform-input"
                          rows={4}
                          value={notes[index] || ''}
                          onChange={(event) => setNotes((previous) => ({ ...previous, [index]: event.target.value }))}
                          placeholder="Escribe tus observaciones y conclusiones"
                        />
                        <Link to={resource.link.to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ink)]">
                          {resource.link.label}
                          <i className="fa-solid fa-arrow-right text-xs"></i>
                        </Link>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          <Link to="/mentor?cat=trading" className="note-paper note-link group relative isolate block overflow-hidden rounded-[20px] p-6">
            <SmallRosette className="pointer-events-none absolute -bottom-10 -right-10 -z-10 h-36 w-36 opacity-50" />
            <h2 className="note-display flex items-center gap-2 text-xl font-extrabold text-[var(--text)]">
              <i className="fa-solid fa-robot text-base text-[var(--ink)]"></i>
              Kor &middot; Mentor IA
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-muted)]">Consulta tus dudas y repasa los conceptos de este camino con Kor.</p>
            <span className="note-display mt-3 inline-flex items-center gap-1.5 text-base font-bold text-[var(--ink)]">
              Preguntar a Kor
              <i className="fa-solid fa-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-1"></i>
            </span>
          </Link>
        </aside>
      </div>

      {unitReward !== null && <RewardModal reward={unitReward} onClose={() => setUnitReward(null)} />}
      {isGuest && isGuestGateOpen && <GuestSignupGate onClose={() => setIsGuestGateOpen(false)} />}
    </div>
  )
}
