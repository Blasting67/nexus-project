import React, { useMemo, useState } from 'react'
import { BlockchainCard } from '../BlockchainCard'
import { CHAIN_ALTERED, CHAIN_BLOCKS, CHAIN_STEPS, PROTECTION } from '../BlockchainData'
import { BC_ICONS } from '../BlockchainIcons'
import { Callout, Eyebrow } from '../FormalParts'
import { sha256Hex } from '../sha256'

interface CardProps {
  className?: string
  index?: number
}

const CheckIcon = BC_ICONS.check
const ORIGINAL = 'Hola'

/** Manchas pastel difuminadas que se desvanecen solas dentro de la tarjeta. */
const GLOW =
  'radial-gradient(ellipse 40% 55% at 6% 10%, rgba(186,230,253,0.5) 0%, rgba(186,230,253,0) 100%),' +
  'radial-gradient(ellipse 40% 55% at 96% 96%, rgba(167,243,208,0.42) 0%, rgba(167,243,208,0) 100%),' +
  'radial-gradient(ellipse 28% 40% at 92% 6%, rgba(221,214,254,0.4) 0%, rgba(221,214,254,0) 100%)'

const PANEL = 'rounded-xl border border-slate-200 bg-white/70 p-5'
const short = (h: string) => `${h.slice(0, 8)}…${h.slice(-4)}`

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9 9l6 6M15 9l-6 6" />
  </svg>
)

const Arrow: React.FC = () => (
  <span aria-hidden="true" className="flex items-center justify-center text-slate-300 max-md:rotate-90">
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8h12M9.5 3.5L14 8l-4.5 4.5" />
    </svg>
  </span>
)

/* ------------------------------------------------------------------ */
/* 1. Hash: una "máquina" matemática que convierte cualquier cosa en una huella */
/* ------------------------------------------------------------------ */

const HashPanel: React.FC = () => {
  const [text, setText] = useState(ORIGINAL)
  const originalHash = useMemo(() => sha256Hex(ORIGINAL), [])
  const hash = useMemo(() => sha256Hex(text), [text])
  const edited = text !== ORIGINAL

  return (
    <>
      <Eyebrow className="text-indigo-500">Hash</Eyebrow>
      <h4 className="mt-0.5 text-2xl font-semibold text-slate-900">{PROTECTION.hash.question}</h4>
      <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{PROTECTION.hash.text}</p>

      <div className="mt-4 grid items-stretch gap-2 md:grid-cols-[13rem_auto_8.5rem_auto_minmax(0,1fr)]">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <label htmlFor="bc-hash-input" className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Entrada
          </label>
          <input
            id="bc-hash-input"
            value={text}
            maxLength={24}
            onChange={(e) => setText(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
          <p className="mt-2 text-[11px] leading-snug text-slate-500">{PROTECTION.hash.inputs.join(' · ')}</p>
        </div>

        <Arrow />

        <div className="flex flex-col items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50/70 px-3 py-3 text-center">
          <span aria-hidden="true" className="text-indigo-500">
            <BC_ICONS.hash className="h-6 w-6" />
          </span>
          <p className="mt-1 text-sm font-semibold text-indigo-900">{PROTECTION.hash.machine}</p>
          <p className="text-xs text-indigo-600">{PROTECTION.hash.machineSub}</p>
        </div>

        <Arrow />

        <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Hash · {hash.length} caracteres</p>
          <p className="mt-1.5 break-all font-mono text-[12.5px] leading-[1.35rem] tracking-wide text-slate-700" aria-label={`Hash de ${text}: ${hash}`}>
            {[...hash].map((ch, i) => (
              <span key={i} className={edited && ch !== originalHash[i] ? 'rounded-sm bg-amber-100 text-amber-900' : ''}>
                {ch}
              </span>
            ))}
          </p>
          <p className="mt-2 text-[11px] leading-snug text-slate-500">
            {edited ? (
              <>
                Los caracteres marcados difieren del hash de “{ORIGINAL}”.{' '}
                <button type="button" onClick={() => setText(ORIGINAL)} className="font-medium text-indigo-600 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
                  Restablecer
                </button>
              </>
            ) : (
              <>
                Ejemplo: “{ORIGINAL}” → <span className="font-mono">{short(originalHash)}</span>. Cambia una letra de la entrada.
              </>
            )}
          </p>
        </div>
      </div>

      <Callout className="mt-4">{PROTECTION.hash.huella}</Callout>
      <ul className="mt-4 grid gap-2 sm:grid-cols-3">
        {PROTECTION.hash.properties.map((p) => (
          <li key={p} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-xs leading-snug text-slate-600">
            <CheckIcon className="mt-px h-4 w-4 shrink-0 text-emerald-600" />
            {p}
          </li>
        ))}
      </ul>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Orden de los bloques: cadena real con hashes reales              */
/* ------------------------------------------------------------------ */

interface ChainBlock {
  n: number
  data: string
  prev: string
  hash: string
  changed: boolean
  altered: boolean
  rewritten: boolean
}

/**
 * Paso 0: cadena original. 1: se altera el bloque 2. 2: se recalcula el 3 (para disimular). 3: se recalcula el 4.
 * Cada bloque guarda el hash del anterior tal como estaba cuando se escribió; el enlace es válido si coincide con el hash actual.
 */
function buildChain(step: number): ChainBlock[] {
  const orig: Array<{ data: string; prev: string; hash: string }> = []
  CHAIN_BLOCKS.forEach((data, i) => {
    const prev = i === 0 ? '0'.repeat(64) : orig[i - 1].hash
    orig.push({ data, prev, hash: sha256Hex(`${i + 1}|${prev}|${data}`) })
  })
  const out: ChainBlock[] = []
  for (let i = 0; i < CHAIN_BLOCKS.length; i++) {
    const rewritten = i >= 2 && step >= i
    const prev = rewritten ? out[i - 1].hash : orig[i].prev
    const altered = i === 1 && step >= 1
    const data = altered ? CHAIN_ALTERED : orig[i].data
    const hash = sha256Hex(`${i + 1}|${prev}|${data}`)
    out.push({ n: i + 1, data, prev, hash, changed: hash !== orig[i].hash, altered, rewritten })
  }
  return out
}

const ChainPanel: React.FC = () => {
  const [step, setStep] = useState(0)
  const chain = useMemo(() => buildChain(step), [step])
  const broken = (i: number) => chain[i + 1].prev !== chain[i].hash

  return (
    <>
      <Eyebrow className="text-indigo-500">Orden de los bloques</Eyebrow>
      <h4 className="mt-0.5 text-2xl font-semibold leading-tight text-slate-900">{PROTECTION.chain.question}</h4>
      <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{PROTECTION.chain.text}</p>

      <ol className="mt-4 grid items-stretch gap-1 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]" aria-label="Cadena de cuatro bloques">
        {chain.map((b, i) => (
          <React.Fragment key={b.n}>
            <li className={`min-w-0 rounded-lg border bg-white p-2.5 transition-colors duration-300 ${b.altered ? 'border-rose-300' : b.rewritten ? 'border-amber-300' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-slate-800">Bloque {b.n}</span>
                {b.altered && <span className="rounded bg-rose-50 px-1.5 text-[10px] font-semibold text-rose-700">alterado</span>}
                {b.rewritten && <span className="rounded bg-amber-50 px-1.5 text-[10px] font-semibold text-amber-800">recalculado</span>}
              </div>
              <p className="mt-1 text-[11px] leading-snug text-slate-600">{b.data}</p>
              <p className="mt-2 font-mono text-[10px] leading-[1.15rem] text-slate-400">
                Anterior
                <br />
                <span className="text-slate-500">{short(b.prev)}</span>
              </p>
              <p className="font-mono text-[10px] leading-[1.15rem] text-slate-400">
                Hash
                <br />
                <span className={`font-semibold ${b.changed ? 'text-rose-600' : 'text-indigo-600'}`}>{short(b.hash)}</span>
              </p>
            </li>
            {i < chain.length - 1 && (
              <li aria-hidden="false" className="flex flex-col items-center justify-center gap-0.5 px-0.5 max-md:py-1">
                {broken(i) ? (
                  <>
                    <XIcon className="h-5 w-5 text-rose-500" />
                    <span className="text-[10px] font-semibold leading-none text-rose-600">roto</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-5 w-5 text-emerald-600" />
                    <span className="text-[10px] leading-none text-slate-400">enlace</span>
                  </>
                )}
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => (s + 1) % CHAIN_STEPS.length)}
          className="rounded-md bg-slate-900 px-3.5 py-2 text-xs font-medium text-white transition-colors duration-200 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
        >
          {CHAIN_STEPS[step].button}
        </button>
        <p aria-live="polite" className="min-w-0 flex-1 text-sm leading-snug text-slate-600" key={step}>
          <span className="bc-fade inline-block">{CHAIN_STEPS[step].text}</span>
        </p>
      </div>
      <Callout className="mt-4">{PROTECTION.chain.cost}</Callout>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Integridad: firma digital y clave pública                         */
/* ------------------------------------------------------------------ */

type Change = 'none' | 'amount' | 'recipient'
const TX = { from: 'Ana', to: 'Luis', amount: '2 BTC' }
const messageOf = (c: Change) => `${TX.from} → ${c === 'recipient' ? 'Eva' : TX.to}: ${c === 'amount' ? '20 BTC' : TX.amount}`

const SignaturePanel: React.FC = () => {
  const [change, setChange] = useState<Change>('none')
  // demostración simplificada: la "firma" depende del mensaje original; en la red real se usa ECDSA
  const signature = useMemo(() => sha256Hex(`firma:${TX.from}:${messageOf('none')}`).slice(0, 32), [])
  const matches = sha256Hex(`firma:${TX.from}:${messageOf(change)}`).slice(0, 32) === signature
  const S = PROTECTION.signature
  const results = [true, true, matches]

  const btn = (id: Change, label: string) => (
    <button
      key={id}
      type="button"
      aria-pressed={change === id}
      onClick={() => setChange(change === id ? 'none' : id)}
      className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
        change === id ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  )

  return (
    <>
      <Eyebrow className="text-indigo-500">Integridad y firmas</Eyebrow>
      <h4 className="mt-0.5 text-2xl font-semibold leading-tight text-slate-900">{S.question}</h4>
      <p className="text-sm text-slate-500">{S.sub}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{S.text}</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Transacción firmada</p>
          <p className={`mt-2 text-base font-medium ${matches ? 'text-slate-900' : 'text-rose-700'}`}>{messageOf(change)}</p>
          <p className="mt-2 text-[11px] text-slate-400">
            Firma (clave privada de {TX.from}) <span className="font-mono text-slate-500">{signature.slice(0, 20)}…</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {btn('amount', 'Cambiar el monto')}
            {btn('recipient', 'Cambiar el destinatario')}
          </div>
          <p className="mt-2 text-[10.5px] leading-snug text-slate-400">Demostración simplificada: en la red real la firma se calcula con ECDSA.</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-800">{S.verifyLabel}</p>
          <ol className="mt-2 space-y-1.5">
            {S.verify.map((v, i) => (
              <li key={v} className="flex items-start gap-2.5 text-sm leading-snug text-slate-600">
                {results[i] ? <CheckIcon className="mt-px h-4 w-4 shrink-0 text-emerald-600" /> : <XIcon className="mt-px h-4 w-4 shrink-0 text-rose-500" />}
                <span className={results[i] ? '' : 'font-medium text-rose-700'}>{v}</span>
              </li>
            ))}
          </ol>
          <p
            key={String(matches)}
            aria-live="polite"
            className={`bc-fade mt-3 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ${
              matches ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-rose-50 text-rose-700 ring-rose-200'
            }`}
          >
            {matches ? 'Firma válida: la red acepta la transacción' : 'Firma inválida: los nodos rechazan la transacción'}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-600">{S.rejected}</p>
      <Callout className="mt-3">{S.ecdsa}</Callout>
    </>
  )
}

/** Tarjeta 5: ¿Cómo se protege la información? — hash, orden de los bloques e integridad, con una demostración de cada uno. */
export const ProtectionCard: React.FC<CardProps> = ({ className, index }) => {
  const [selected, setSelected] = useState('hash')

  return (
    <BlockchainCard variant="formal" glow={GLOW} number="5" title="¿Cómo se protege la información?" tone="emerald" className={className} index={index}>
      <p className="max-w-4xl text-[15px] leading-relaxed text-slate-600">{PROTECTION.intro}</p>

      <div className="mt-5 grid gap-5 md:grid-cols-[16rem_minmax(0,1fr)]">
        <div role="group" aria-label="Mecanismos de protección" className="space-y-1.5">
          {PROTECTION.topics.map((t, i) => {
            const on = t.id === selected
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={on}
                onClick={() => setSelected(t.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  on ? 'bg-white shadow-sm ring-1 ring-indigo-200' : 'hover:bg-white/60'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-semibold tabular-nums transition-colors duration-200 ${on ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className={`block text-sm leading-tight ${on ? 'font-semibold text-indigo-900' : 'font-medium text-slate-700'}`}>{t.label}</span>
                  <span className="sr-only">: </span>
                  <span className="block text-xs leading-tight text-slate-500">{t.sub}</span>
                </span>
              </button>
            )
          })}
        </div>

        <div aria-live="polite" className={`${PANEL} min-h-[25rem] min-w-0`}>
          <div key={selected} className="bc-fade">
            {selected === 'hash' && <HashPanel />}
            {selected === 'chain' && <ChainPanel />}
            {selected === 'signature' && <SignaturePanel />}
          </div>
        </div>
      </div>
    </BlockchainCard>
  )
}