import React from 'react'

/** Animaciones del HUD (keyframes). Van aquí para que no haya que tocar tailwind.config. */
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

@media (prefers-reduced-motion:reduce){
  .hud-label-in,.hud-wheel,.hud-bob,.hud-nudge,.hud-glow,.hud-glow-sky,.hud-fade,.hud-ping{animation:none!important}
}
`

export const HudStyles: React.FC = () => <style>{CSS}</style>