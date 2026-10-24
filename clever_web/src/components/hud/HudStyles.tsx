import React from 'react'

const CSS = `
.hud-label-in{animation:hud-label-in .5s cubic-bezier(.22,1,.36,1) both}
@keyframes hud-label-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

.hud-wheel{animation:hud-wheel 1.8s ease-in-out infinite}
@keyframes hud-wheel{0%{opacity:0;transform:translateY(-3px)}30%{opacity:1}100%{opacity:0;transform:translateY(6px)}}

.hud-bob{animation:hud-bob 1.8s ease-in-out infinite}
@keyframes hud-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(3px)}}

.hud-nudge{animation:hud-nudge 1.2s ease-in-out infinite}
@keyframes hud-nudge{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}

.hud-glow{animation:hud-glow 3.2s ease-in-out infinite}
@keyframes hud-glow{0%,100%{box-shadow:0 8px 20px -8px rgba(139,92,246,.35)}50%{box-shadow:0 12px 28px -6px rgba(139,92,246,.6)}}

.hud-glow-sky{animation:hud-glow-sky 3.2s ease-in-out infinite}
@keyframes hud-glow-sky{0%,100%{box-shadow:0 6px 16px -6px rgba(14,165,233,.35)}50%{box-shadow:0 10px 24px -6px rgba(14,165,233,.55)}}

.hud-fade{animation:hud-fade .45s ease-out both}
@keyframes hud-fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

.hud-ping{animation:hud-ping 1.6s ease-out infinite}
@keyframes hud-ping{0%{transform:scale(.8);opacity:.7}100%{transform:scale(2.2);opacity:0}}


:root{--hud-emerald:#065f46;--hud-emerald-soft:#059669;--hud-rose:#9f1239;--hud-rose-soft:#e11d48;--hud-violet:#6d28d9;--hud-violet-soft:#7c3aed}
:root:is([data-theme="dark"],[data-theme="terminal"],[data-theme="aurora"],[data-theme="neon"],[data-theme="sunset"],[data-theme="ocean"]){--hud-emerald:#6ee7b7;--hud-emerald-soft:#34d399;--hud-rose:#fda4af;--hud-rose-soft:#fb7185;--hud-violet:#c4b5fd;--hud-violet-soft:#a78bfa}
.hud-panel{background:color-mix(in srgb,var(--surface) 84%,transparent);--tw-ring-color:var(--border)}
.hud-panel-active{background:var(--surface);--tw-ring-color:color-mix(in srgb,#8b5cf6 55%,var(--border))}
.hud-tint-emerald{background:linear-gradient(135deg,color-mix(in srgb,#10b981 14%,var(--surface)),color-mix(in srgb,#14b8a6 7%,var(--surface)));--tw-ring-color:color-mix(in srgb,#10b981 30%,var(--border))}
.hud-tint-rose{background:linear-gradient(135deg,color-mix(in srgb,#f43f5e 13%,var(--surface)),color-mix(in srgb,#ec4899 7%,var(--surface)));--tw-ring-color:color-mix(in srgb,#f43f5e 28%,var(--border))}
.hud-tint-violet{background:color-mix(in srgb,#8b5cf6 10%,var(--surface));--tw-ring-color:color-mix(in srgb,#8b5cf6 28%,var(--border))}
.hud-tint-duo{background:linear-gradient(90deg,color-mix(in srgb,#8b5cf6 11%,var(--surface)),color-mix(in srgb,#0ea5e9 11%,var(--surface)));--tw-ring-color:var(--border)}
.hud-chip-emerald{background:color-mix(in srgb,#10b981 20%,var(--surface));color:var(--hud-emerald)}
.hud-chip-rose{background:color-mix(in srgb,#f43f5e 18%,var(--surface));color:var(--hud-rose)}
.hud-chip-violet{background:color-mix(in srgb,#8b5cf6 16%,var(--surface));color:var(--hud-violet);--tw-ring-color:color-mix(in srgb,#8b5cf6 28%,var(--border))}
.hud-ink{color:var(--text)}
.hud-ink-soft{color:var(--text-muted)}
.hud-ink-dim{color:var(--text-dim)}
.hud-ink-emerald{color:var(--hud-emerald)}
.hud-ink-rose{color:var(--hud-rose)}
.hud-ink-violet{color:var(--hud-violet-soft)}
.hud-ring-surface{--tw-ring-color:var(--surface)}
:root:is([data-theme="dark"],[data-theme="terminal"],[data-theme="aurora"],[data-theme="neon"],[data-theme="sunset"],[data-theme="ocean"]) .hud-blob{opacity:.28}

@media (prefers-reduced-motion:reduce){
  .hud-label-in,.hud-wheel,.hud-bob,.hud-nudge,.hud-glow,.hud-glow-sky,.hud-fade,.hud-ping{animation:none!important}
}
`

export const HudStyles: React.FC = () => <style>{CSS}</style>