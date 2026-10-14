import React from 'react'
import { BLOCKCHAIN_TONES, BlockchainCard } from '../BlockchainCard'
import { CONSENSUS } from '../BlockchainData'
import { useReveal } from '../../trading/useReveal'

interface CardProps {
  className?: string
  index?: number
}

const COLUMNS = 'grid-cols-[4rem_minmax(0,1fr)_auto]'

/** 4.8 Pruebas de consenso — tabla dinámica: las filas entran en cascada y se iluminan al pasar el mouse. */
export const ConsensusCard: React.FC<CardProps> = ({ className, index }) => {
  const { ref, shown } = useReveal<HTMLDivElement>(0.25)

  return (
    <BlockchainCard number="4.8" title="Pruebas de consenso" tone="rose" className={className} index={index}>
      <div ref={ref} role="table" aria-label="Pruebas de consenso">
        <div role="row" className={`grid ${COLUMNS} gap-x-3 px-3 pb-2 text-[11px] font-semibold text-slate-400`}>
          <span role="columnheader">Consenso</span>
          <span role="columnheader">Cómo funciona</span>
          <span role="columnheader" className="text-right">
            Ejemplo
          </span>
        </div>

        <div role="rowgroup" className="space-y-1">
          {CONSENSUS.map((row, i) => {
            const t = BLOCKCHAIN_TONES[row.tone]
            return (
              <div
                key={row.id}
                role="row"
                style={{ transitionDelay: `${i * 90}ms` }}
                className={`group relative grid ${COLUMNS} items-center gap-x-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm transition duration-500 ease-out hover:bg-slate-50 motion-reduce:transition-none ${
                  shown ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-2 left-0 w-1 origin-center scale-y-0 rounded-full transition-transform duration-300 group-hover:scale-y-100 motion-reduce:transition-none ${t.dot}`}
                />
                <span role="cell">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-bold ring-1 ${t.chip}`}>{row.name}</span>
                </span>
                <span role="cell" className="leading-snug text-slate-600 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none">
                  {row.how}
                </span>
                <span role="cell" className={`text-right text-xs font-semibold ${t.text}`}>
                  {row.example}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </BlockchainCard>
  )
}
