import React from 'react'

export const CandlestickStructure: React.FC = () => {
  return (
    <div className="platform-card p-6 space-y-6">
      <h2 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider font-mono">
        Estructura de una Vela Japonesa
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="p-6 bg-[var(--bg-alt)] border border-[var(--border)] rounded flex justify-around items-center">
          <div className="text-center space-y-2">
            <div className="text-xs font-semibold text-emerald-400">Vela Alcista</div>
            <div className="w-12 h-32 mx-auto flex flex-col items-center justify-center">
              <div className="w-0.5 h-6 bg-emerald-400"></div>
              <div className="w-8 h-16 bg-emerald-500 rounded-sm flex items-center justify-center text-[9px] text-black font-bold">
                Cuerpo
              </div>
              <div className="w-0.5 h-6 bg-emerald-400"></div>
            </div>
            <div className="text-[10px] text-[var(--text-muted)] font-mono">Cierre &gt; Apertura</div>
          </div>

          <div className="text-center space-y-2">
            <div className="text-xs font-semibold text-rose-400">Vela Bajista</div>
            <div className="w-12 h-32 mx-auto flex flex-col items-center justify-center">
              <div className="w-0.5 h-6 bg-rose-400"></div>
              <div className="w-8 h-16 bg-rose-500 rounded-sm flex items-center justify-center text-[9px] text-white font-bold">
                Cuerpo
              </div>
              <div className="w-0.5 h-6 bg-rose-400"></div>
            </div>
            <div className="text-[10px] text-[var(--text-muted)] font-mono">Cierre &lt; Apertura</div>
          </div>
        </div>

        <div className="space-y-3 text-xs text-[var(--text-muted)] leading-relaxed">
          <p>
            El cuerpo muestra la diferencia entre el precio de apertura y el de cierre. Las mechas señalan los precios extremos alcanzados durante el periodo evaluado.
          </p>
          <p>
            Una mecha inferior pronunciada sugiere que los compradores lograron rechazar precios más bajos antes del cierre.
          </p>
        </div>
      </div>
    </div>
  )
}