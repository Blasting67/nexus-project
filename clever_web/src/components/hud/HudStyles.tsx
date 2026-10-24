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

.tt-card{position:relative;transform:translateY(0) scale(1);transition:transform .55s cubic-bezier(.22,1,.36,1),box-shadow .55s cubic-bezier(.22,1,.36,1),background-color .35s ease,--tw-ring-color .35s ease;will-change:transform}
.tt-card::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;background:radial-gradient(120% 140% at 0% 0%,color-mix(in srgb,var(--tt-tone) 16%,transparent),transparent 65%);transition:opacity .45s ease}
.tt-card:hover{transform:translateY(-5px) scale(1.012);box-shadow:0 18px 32px -20px color-mix(in srgb,var(--tt-tone) 75%,transparent);--tw-ring-color:color-mix(in srgb,var(--tt-tone) 45%,var(--border))}
.tt-card:hover::before,.tt-card[aria-pressed="true"]::before{opacity:1}
.tt-card[aria-pressed="true"]{transform:translateY(-2px) scale(1.03);box-shadow:0 16px 30px -18px color-mix(in srgb,var(--tt-tone) 80%,transparent);--tw-ring-color:color-mix(in srgb,var(--tt-tone) 60%,var(--border))}
.tt-card[aria-pressed="true"]:hover{transform:translateY(-6px) scale(1.035)}
.tt-card:active{transform:translateY(-1px) scale(.985);transition-duration:.18s}
.tt-card .tt-icon{transition:transform .6s cubic-bezier(.34,1.45,.64,1),box-shadow .45s ease}
.tt-card:hover .tt-icon{transform:translateY(-2px) rotate(-8deg) scale(1.1);box-shadow:0 10px 18px -10px var(--tt-tone)}
.tt-card .tt-name{transition:color .3s ease}
.tt-card:hover .tt-name{color:color-mix(in srgb,var(--tt-tone) 70%,var(--text))}
.hr-list{scrollbar-width:none;-ms-overflow-style:none}
.hr-list::-webkit-scrollbar{display:none}
.hr-item{opacity:0;clip-path:inset(0 0 100% 0);filter:blur(4px);transition:opacity .5s ease,clip-path .65s cubic-bezier(.22,1,.36,1),filter .5s ease}
.hr-item.hr-in{opacity:1;clip-path:inset(0 0 0 0);filter:none}
.hr-row{position:relative;transition:background-color .35s ease,opacity .3s ease,box-shadow .35s ease}
.hr-row::before{content:"";position:absolute;left:0;top:22%;bottom:22%;width:3px;border-radius:3px;background:linear-gradient(180deg,#8b5cf6,#0ea5e9);transform:scaleY(0);transition:transform .45s cubic-bezier(.22,1,.36,1)}
.hr-row:hover{background:color-mix(in srgb,var(--surface-alt) 85%,transparent)}
.hr-row:hover::before,.hr-row[aria-pressed="true"]::before{transform:scaleY(1)}
.hr-row .hr-text,.hr-row .hr-icon,.hr-row .hr-tag{transition:transform .5s cubic-bezier(.22,1,.36,1)}
.hr-row:hover .hr-text{transform:translateX(4px)}
.hr-row:hover .hr-icon,.hr-icon-on{transform:scale(1.08) rotate(-6deg)}
.hr-row:hover .hr-tag{transform:translateX(-2px) scale(1.04)}
.hr-row:active .hr-icon{transform:scale(.94);transition-duration:.15s}

@media (max-height:760px){.tt-scale{display:none!important}.tt-intro{margin-bottom:.5rem}}
@media (max-height:640px){.tt-sub{display:none}.tt-pitch{padding-top:.5rem;padding-bottom:.5rem}}

@media (prefers-reduced-motion:reduce){
  .hud-label-in,.hud-wheel,.hud-bob,.hud-nudge,.hud-glow,.hud-glow-sky,.hud-fade,.hud-ping{animation:none!important}
  .tt-card,.tt-card .tt-icon,.tt-card::before,.hr-item,.hr-row,.hr-row::before,.hr-row .hr-text,.hr-row .hr-icon,.hr-row .hr-tag{transition:none!important}
  .hr-row:hover .hr-text,.hr-row:hover .hr-icon,.hr-row:hover .hr-tag{transform:none}
  .tt-card:hover,.tt-card:hover .tt-icon{transform:none}
}
`

export const HudStyles: React.FC = () => <style>{CSS}</style>