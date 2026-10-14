import React from 'react'

/**
 * Animaciones del módulo (keyframes). Tailwind no las trae, así que van aquí
 * y el módulo es autocontenido: no hay que tocar tailwind.config.
 */
const CSS = `
.bc-origin-l{transform-box:fill-box;transform-origin:0% 50%}
.bc-origin-c{transform-box:fill-box;transform-origin:50% 50%}

/* líneas de conexión con paquetes que viajan */
.bc-flow{stroke-dasharray:3 6;animation:bc-flow 2.6s linear infinite}
.bc-flow-fast{animation-duration:.8s}
@keyframes bc-flow{to{stroke-dashoffset:-18}}

/* latido suave y flotación */
.bc-pulse{animation:bc-pulse 3.6s ease-in-out infinite}
@keyframes bc-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}
.bc-float{animation:bc-float 5s ease-in-out infinite}
@keyframes bc-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.bc-spin{animation:bc-spin 9s linear infinite}
@keyframes bc-spin{to{transform:rotate(360deg)}}

/* escritura de una línea nueva en el cuaderno y onda expansiva */
.bc-grow{animation:bc-grow .7s ease-out both}
@keyframes bc-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.bc-ring{animation:bc-ring 1.4s ease-out both}
@keyframes bc-ring{0%{opacity:.7;transform:scale(.25)}100%{opacity:0;transform:scale(1.7)}}

/* alteración detectada */
.bc-shake{animation:bc-shake .5s ease-in-out 2}
@keyframes bc-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}

/* entradas suaves al cambiar de selección */
.bc-pop{animation:bc-pop .45s cubic-bezier(.34,1.56,.64,1) both}
@keyframes bc-pop{from{opacity:0;transform:translateY(6px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
.bc-fade{animation:bc-fade .35s ease-out both}
@keyframes bc-fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
.bc-mark{animation:bc-mark 1.1s ease-out both}
@keyframes bc-mark{from{background-color:rgba(253,230,138,.95)}to{background-color:rgba(253,230,138,.4)}}

/* monedas que recorren sus carreteras */
.bc-travel{animation:bc-travel var(--bc-t,3s) ease-in-out infinite}
@keyframes bc-travel{0%{transform:translateX(0);opacity:0}12%{opacity:1}88%{opacity:1}100%{transform:translateX(var(--bc-dist,100px));opacity:0}}

@media (prefers-reduced-motion:reduce){
  .bc-flow,.bc-pulse,.bc-float,.bc-spin,.bc-grow,.bc-ring,.bc-shake,.bc-pop,.bc-fade,.bc-mark,.bc-travel{animation:none!important}
}
`

export const BlockchainStyles: React.FC = () => <style>{CSS}</style>
