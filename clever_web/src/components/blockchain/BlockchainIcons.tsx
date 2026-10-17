import React from 'react'

export type BcIconKey =
  | 'network'
  | 'node'
  | 'miner'
  | 'consensus'
  | 'contract'
  | 'asset'
  | 'hash'
  | 'signature'
  | 'coin'
  | 'token'
  | 'phone'
  | 'usb'
  | 'bank'
  | 'check'
  | 'lock'
  | 'bridge'

const Svg: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = 'h-5 w-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
)

export const BC_ICONS: Record<BcIconKey, React.FC<{ className?: string }>> = {
  // tres nodos conectados
  network: (p) => (
    <Svg {...p}>
      <circle cx="6" cy="7" r="2.2" />
      <circle cx="18" cy="7" r="2.2" />
      <circle cx="12" cy="18" r="2.2" />
      <path d="M8 7.4l8 0M7 9l4 7M17 9l-4 7" />
    </Svg>
  ),
  // computadora
  node: (p) => (
    <Svg {...p}>
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M9 20h6M12 16v4" />
    </Svg>
  ),
  // pico de minero
  miner: (p) => (
    <Svg {...p}>
      <path d="M6 19l8-8" />
      <path d="M7.5 7.5C10.5 4.5 16 5 19 8c-3-.5-5.5.5-7 2.5" />
      <path d="M7.5 7.5c-.5 3 .5 5.5 2.5 7" />
    </Svg>
  ),
  // engranaje
  consensus: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </Svg>
  ),
  // documento con visto
  contract: (p) => (
    <Svg {...p}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M9.5 13.5l2 2 3.5-4" />
    </Svg>
  ),
  // hexágono con moneda
  asset: (p) => (
    <Svg {...p}>
      <path d="M12 3l7.5 4.2v8.6L12 20l-7.5-4.2V7.2z" />
      <circle cx="12" cy="11.5" r="2.4" />
    </Svg>
  ),
  // huella
  hash: (p) => (
    <Svg {...p}>
      <path d="M4 12c0-5 3-8 8-8s8 3 8 8" />
      <path d="M7 18c0-6 1.5-9 5-9s5 3 5 9" />
      <path d="M10 19c0-4 .5-6 2-6s2 2 2 6" />
      <path d="M12 16.5v3" />
    </Svg>
  ),
  // escudo con visto
  signature: (p) => (
    <Svg {...p}>
      <path d="M12 3l7 3v5c0 4.6-3 7.6-7 9.5C8 18.6 5 15.6 5 11V6z" />
      <path d="M9 12l2 2 4-4" />
    </Svg>
  ),
  // moneda
  coin: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10 8h3a2 2 0 0 1 0 4h-3zM10 12h3.5a2 2 0 0 1 0 4H10zM10 6.5V8M10 16v1.5M13 6.5V8M13 16v1.5" />
    </Svg>
  ),
  // ficha con escudo
  token: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5l3.2 1.3v3c0 2.2-1.5 3.6-3.2 4.2-1.7-.6-3.2-2-3.2-4.2v-3z" />
    </Svg>
  ),
  // teléfono
  phone: (p) => (
    <Svg {...p}>
      <rect x="7" y="3" width="10" height="18" rx="2.2" />
      <path d="M11 18h2" />
    </Svg>
  ),
  // memoria USB
  usb: (p) => (
    <Svg {...p}>
      <rect x="7" y="9" width="10" height="12" rx="2" />
      <path d="M9.5 9V3.5h5V9" />
      <path d="M11 5.5h.01M13 5.5h.01" />
    </Svg>
  ),
  // banco
  bank: (p) => (
    <Svg {...p}>
      <path d="M3 9l9-5 9 5" />
      <path d="M5 9v9M9.5 9v9M14.5 9v9M19 9v9" />
      <path d="M3 20h18" />
    </Svg>
  ),
  check: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.2l2.5 2.5 4.5-5" />
    </Svg>
  ),
  lock: (p) => (
    <Svg {...p}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </Svg>
  ),
  // dos redes unidas por un puente
  bridge: (p) => (
    <Svg {...p}>
      <circle cx="5" cy="15" r="2.2" />
      <circle cx="19" cy="15" r="2.2" />
      <path d="M5 12.8C5 6 19 6 19 12.8" />
      <path d="M9 17.5h6" />
    </Svg>
  ),
}