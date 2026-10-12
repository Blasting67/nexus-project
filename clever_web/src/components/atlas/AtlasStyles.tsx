import React from 'react'

/**
 * Keyframes del Atlas. Tailwind no trae estas animaciones, así que van aquí
 * y el componente es autocontenido (no hay que tocar tailwind.config).
 * Las duraciones se controlan con la variable CSS --d desde cada tarjeta.
 */
const CSS = `
.atlas-box{transform-box:fill-box;transform-origin:center}
.atlas-wobble{animation:atlas-wobble var(--d,3s) ease-in-out infinite}
.atlas-drift{animation:atlas-drift var(--d,1.4s) linear infinite}
.atlas-bob{animation:atlas-bob var(--d,2.6s) ease-in-out infinite}
.atlas-trail{animation:atlas-trail var(--d,1s) linear infinite}
.atlas-wave{animation:atlas-wave var(--d,3s) linear infinite}
.atlas-flow{animation:atlas-flow var(--d,1.2s) ease-out infinite}
.atlas-shake{animation:atlas-shake .3s ease-in-out infinite}
.atlas-rise{animation:atlas-rise var(--d,3s) linear infinite}
.atlas-fog{animation:atlas-fog var(--d,14s) ease-in-out infinite}
.atlas-flash{animation:atlas-flash var(--d,4s) linear infinite}
.atlas-rain{animation:atlas-rain var(--d,.9s) linear infinite}
.atlas-twinkle{animation:atlas-twinkle var(--d,3s) ease-in-out infinite}
.atlas-spin{animation:atlas-spin var(--d,14s) linear infinite}
.atlas-reveal{animation:atlas-reveal .9s ease-out both}

@keyframes atlas-wobble{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-3px) scale(1.012)}}
@keyframes atlas-drift{0%{transform:translate(0,0);opacity:0}20%{opacity:1}100%{transform:translate(var(--dx,10px),var(--dy,-14px));opacity:0}}
@keyframes atlas-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes atlas-trail{from{stroke-dashoffset:24}to{stroke-dashoffset:0}}
@keyframes atlas-wave{from{transform:translateX(0)}to{transform:translateX(-80px)}}
@keyframes atlas-flow{0%{opacity:0;transform:translateX(0)}20%{opacity:1}100%{opacity:0;transform:translateX(var(--to,0px))}}
@keyframes atlas-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-1px)}75%{transform:translateX(1px)}}
@keyframes atlas-rise{0%{transform:translateY(0);opacity:0}10%{opacity:.7}100%{transform:translateY(-90px);opacity:0}}
@keyframes atlas-fog{0%,100%{transform:translate(0,0)}50%{transform:translate(16px,-6px)}}
@keyframes atlas-flash{0%,90%,100%{opacity:0}92%,96%{opacity:1}94%{opacity:.25}}
@keyframes atlas-rain{0%{transform:translateY(-6px);opacity:0}20%{opacity:1}100%{transform:translateY(34px);opacity:0}}
@keyframes atlas-twinkle{0%,100%{opacity:.15;transform:translateY(0)}50%{opacity:1;transform:translateY(-5px)}}
@keyframes atlas-spin{to{transform:rotate(360deg)}}
@keyframes atlas-reveal{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}

@media (prefers-reduced-motion:reduce){
  .atlas-wobble,.atlas-drift,.atlas-bob,.atlas-trail,.atlas-wave,.atlas-flow,.atlas-shake,
  .atlas-rise,.atlas-fog,.atlas-flash,.atlas-rain,.atlas-twinkle,.atlas-spin,.atlas-reveal{animation:none!important}
}
`

export const AtlasStyles: React.FC = () => <style>{CSS}</style>
