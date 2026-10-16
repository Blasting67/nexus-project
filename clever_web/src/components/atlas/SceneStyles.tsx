import React from 'react'

/**
 * Animaciones de las tarjetas-escena del Atlas (prefijo sc-).
 * Las duraciones y los desplazamientos se controlan desde cada escena con variables CSS (--d, --h, --dx…).
 */
const CSS = `
.sc-fb{transform-box:fill-box}
.sc-oc{transform-origin:center}
.sc-ob{transform-origin:50% 100%}
.sc-ot{transform-origin:50% 0}
.sc-ol{transform-origin:0 50%}

.sc-spin{animation:sc-spin var(--d,40s) linear infinite}
.sc-spin-rev{animation:sc-spin var(--d,40s) linear infinite reverse}
.sc-needle{animation:sc-needle var(--d,2.6s) ease-in-out infinite}
.sc-flow-up{animation:sc-flow-up var(--d,2.4s) ease-in-out infinite}
.sc-flow-down{animation:sc-flow-down var(--d,2.4s) ease-in-out infinite}
.sc-flow-x{animation:sc-flow-x var(--d,3s) ease-in-out infinite}
.sc-billow{animation:sc-billow var(--d,3s) ease-in-out infinite}
.sc-rain{animation:sc-rain var(--d,.8s) linear infinite}
.sc-bolt{animation:sc-bolt var(--d,3s) linear infinite}
.sc-wind{animation:sc-wind var(--d,2.4s) linear infinite}
.sc-seis{animation:sc-seis var(--d,3s) linear infinite}
.sc-cloud-x{animation:sc-cloud-x var(--d,24s) linear infinite}
.sc-flap{animation:sc-flap .5s ease-in-out infinite}
.sc-glide{animation:sc-glide var(--d,16s) linear infinite}
.sc-pulse{animation:sc-pulse var(--d,3s) ease-in-out infinite}
.sc-fog{animation:sc-fog var(--d,14s) ease-in-out infinite}
.sc-qmark{animation:sc-qmark var(--d,5s) ease-in infinite}
.sc-flag{animation:sc-flag 1.3s ease-in-out infinite}
.sc-snow{animation:sc-snow var(--d,6s) linear infinite}
.sc-flame{animation:sc-flame var(--d,.9s) ease-in-out infinite}
.sc-ember{animation:sc-ember var(--d,3s) ease-out infinite}
.sc-bubble{animation:sc-bubble var(--d,3s) ease-in infinite}
.sc-shiver{animation:sc-shiver .16s linear infinite}
.sc-star{animation:sc-star var(--d,3s) linear infinite}
.sc-flicker{animation:sc-flicker .14s ease-in-out infinite alternate}
.sc-smoke{animation:sc-smoke var(--d,1.6s) ease-out infinite}
.sc-swim-r{animation:sc-swim-r var(--d,12s) linear infinite}
.sc-swim-l{animation:sc-swim-l var(--d,12s) linear infinite}
.sc-sway{animation:sc-sway var(--d,3.6s) ease-in-out infinite}
.sc-caustic{animation:sc-caustic var(--d,5s) ease-in-out infinite}
.sc-coinflip{animation:sc-coinflip var(--d,3.8s) ease-in-out infinite}
.sc-coin-drop{animation:sc-coin-drop var(--d,4s) ease-in infinite}
.sc-stomp{animation:sc-stomp var(--d,.5s) ease-in-out infinite}
.sc-head{animation:sc-head var(--d,3s) ease-in-out infinite}
.sc-blink{animation:sc-blink 4.6s ease-in-out infinite}
.sc-steam{animation:sc-steam var(--d,1.6s) ease-out infinite}
.sc-sweat{animation:sc-sweat 2.2s ease-in infinite}
.sc-chevron{animation:sc-chevron var(--d,1.4s) linear infinite}
.sc-roll{animation:sc-roll var(--d,2s) linear infinite}
.sc-shine{animation:sc-shine 3.8s ease-in-out infinite}
.sc-alarm{animation:sc-alarm var(--d,1.4s) ease-out infinite}
.sc-breathe{animation:sc-breathe var(--d,3s) ease-in-out infinite}
.sc-drop{animation:sc-drop var(--d,2.8s) ease-in infinite}
.sc-ripple{animation:sc-ripple var(--d,2.8s) ease-out infinite}
.sc-stripes{animation:sc-stripes var(--d,1s) linear infinite}
.sc-stripes-l{animation:sc-stripes-l var(--d,1s) linear infinite}

@keyframes sc-spin{to{transform:rotate(360deg)}}
@keyframes sc-needle{0%,100%{transform:rotate(-2.4deg)}50%{transform:rotate(2.4deg)}}
@keyframes sc-flow-up{0%{transform:translate(-8px,16px);opacity:0}30%{opacity:.55}100%{transform:translate(8px,-16px);opacity:0}}
@keyframes sc-flow-down{0%{transform:translate(-8px,-16px);opacity:0}30%{opacity:.55}100%{transform:translate(8px,16px);opacity:0}}
@keyframes sc-flow-x{0%{transform:translateX(-14px);opacity:0}30%{opacity:.5}100%{transform:translateX(14px);opacity:0}}
@keyframes sc-billow{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
@keyframes sc-rain{0%{transform:translate(0,-8px);opacity:0}20%{opacity:.9}100%{transform:translate(-5px,34px);opacity:0}}
@keyframes sc-bolt{0%,86%,100%{opacity:0}88%,92%{opacity:1}90%{opacity:.2}94%{opacity:.7}96%{opacity:0}}
@keyframes sc-wind{0%{transform:translateX(-50px);opacity:0}15%{opacity:.7}85%{opacity:.7}100%{transform:translateX(220px);opacity:0}}
@keyframes sc-seis{to{transform:translateX(-168px)}}
@keyframes sc-cloud-x{0%{transform:translateX(-70px)}100%{transform:translateX(230px)}}
@keyframes sc-flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.35)}}
@keyframes sc-glide{0%{transform:translate(-24px,6px)}50%{transform:translate(90px,-8px)}100%{transform:translate(200px,4px)}}
@keyframes sc-pulse{0%,100%{transform:scale(1)}50%{transform:scale(var(--s,1.25))}}
@keyframes sc-fog{0%,100%{transform:translateX(-14px);opacity:.75}50%{transform:translateX(18px);opacity:1}}
@keyframes sc-qmark{0%{transform:translateY(0) scale(.7);opacity:0}20%{opacity:.85}100%{transform:translateY(-34px) scale(1.15);opacity:0}}
@keyframes sc-flag{0%,100%{transform:skewY(-7deg) scaleX(1)}50%{transform:skewY(7deg) scaleX(.86)}}
@keyframes sc-snow{0%{transform:translate(0,-12px) rotate(0);opacity:0}10%{opacity:1}100%{transform:translate(var(--dx,10px),196px) rotate(220deg);opacity:.9}}
@keyframes sc-flame{0%,100%{transform:scale(1,1) skewX(0)}30%{transform:scale(.9,1.16) skewX(-4deg)}65%{transform:scale(1.06,.9) skewX(4deg)}}
@keyframes sc-ember{0%{transform:translate(0,0);opacity:0}15%{opacity:1}100%{transform:translate(var(--dx,6px),-64px);opacity:0}}
@keyframes sc-bubble{0%{transform:translateY(0);opacity:0}12%{opacity:.8}100%{transform:translateY(var(--h,-80px));opacity:0}}
@keyframes sc-shiver{0%,100%{transform:translateX(0)}25%{transform:translateX(-.9px)}75%{transform:translateX(.9px)}}
@keyframes sc-star{0%{transform:translateY(-24px);opacity:0}12%{opacity:1}100%{transform:translateY(200px);opacity:.6}}
@keyframes sc-flicker{from{transform:scaleY(.86) scaleX(1.04)}to{transform:scaleY(1.1) scaleX(.94)}}
@keyframes sc-smoke{0%{transform:translateY(0) scale(.5);opacity:.6}100%{transform:translateY(34px) scale(1.9);opacity:0}}
@keyframes sc-swim-r{0%{transform:translateX(-34px)}100%{transform:translateX(206px)}}
@keyframes sc-swim-l{0%{transform:translateX(206px)}100%{transform:translateX(-34px)}}
@keyframes sc-sway{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
@keyframes sc-caustic{0%,100%{opacity:.04}50%{opacity:.2}}
@keyframes sc-coinflip{0%,100%{transform:scaleX(1)}45%{transform:scaleX(.08)}55%{transform:scaleX(.08)}}
@keyframes sc-coin-drop{0%{transform:translateY(-30px) rotate(0);opacity:0}15%{opacity:1}100%{transform:translateY(130px) rotate(360deg);opacity:.2}}
@keyframes sc-stomp{0%,100%{transform:translateY(0)}50%{transform:translateY(3.5px)}}
@keyframes sc-head{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@keyframes sc-blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}
@keyframes sc-steam{0%{transform:translate(0,0) scale(.5);opacity:0}20%{opacity:.85}100%{transform:translate(var(--dx,0px),-22px) scale(1.7);opacity:0}}
@keyframes sc-sweat{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(14px);opacity:0}}
@keyframes sc-chevron{0%{transform:translateX(0);opacity:0}25%{opacity:1}75%{opacity:1}100%{transform:translateX(var(--to,24px));opacity:0}}
@keyframes sc-roll{to{transform:rotate(360deg)}}
@keyframes sc-shine{0%,55%{transform:translateX(-90px)}100%{transform:translateX(120px)}}
@keyframes sc-alarm{0%{transform:scale(.9);opacity:.7}100%{transform:scale(1.7);opacity:0}}
@keyframes sc-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}
@keyframes sc-drop{0%{transform:translateY(0) rotate(0);opacity:0}12%{opacity:1}86%{opacity:1}100%{transform:translateY(var(--h,40px)) rotate(300deg);opacity:0}}
@keyframes sc-ripple{0%,84%{transform:scale(.2);opacity:0}86%{transform:scale(.3);opacity:.85}100%{transform:scale(1.7);opacity:0}}
@keyframes sc-stripes{to{background-position:18px 0}}
@keyframes sc-stripes-l{to{background-position:-18px 0}}

@media (prefers-reduced-motion:reduce){
  [class^="sc-"],[class*=" sc-"]{animation:none!important}
}
`

export const SceneStyles: React.FC = () => <style>{CSS}</style>