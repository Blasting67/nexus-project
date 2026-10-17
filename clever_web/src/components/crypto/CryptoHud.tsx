import React from 'react'
import { BackToAnalysisButton } from '../analysis/BackToAnalysisButton'
import { BitcoinAtlas } from '../atlas/BitcoinAtlas'
import { BlockchainStyles } from '../blockchain/BlockchainStyles'
import { BasicConceptsCard } from '../blockchain/cards/BasicConceptsCard'
import { BitcoinGoldCard } from '../blockchain/cards/BitcoinGoldCard'
import { ConsensusCard } from '../blockchain/cards/ConsensusCard'
import { CryptoTokensCard } from '../blockchain/cards/CryptoTokensCard'
import { LayersCard } from '../blockchain/cards/LayersCard'
import { NetworkStandardsCard } from '../blockchain/cards/NetworkStandardsCard'
import { ProtectionCard } from '../blockchain/cards/ProtectionCard'
import { WalletsCard } from '../blockchain/cards/WalletsCard'
import { WhatIsBlockchainCard } from '../blockchain/cards/WhatIsBlockchainCard'
import { HudItem } from '../hud/HudSlide'
import { TopicHud } from '../hud/TopicHud'
import type { Topic } from '../hud/TopicHud'
import { MarketStatusCard } from './MarketStatusCard'

/** Cada subtema es una pantalla con una sola tarjeta, centrada y con el mismo ancho que en acciones (~62 rem). */
const ONE = 'mx-auto grid w-full max-w-[62rem]'
/** Las pruebas de consenso necesitan más espacio (lista de temas + detalle): un poco más ancha que las demás. */
const WIDER = 'mx-auto grid w-full max-w-[72rem]'
/** El Atlas es un tablero grande y usa todo el ancho. */
const WIDE = 'grid w-full'

/**
 * Temas (barra lateral, ↑ ↓) y subtemas (barra de puntos, ← →) del análisis de criptomonedas.
 * Las tarjetas son las mismas de siempre; aquí solo se decide qué tarjeta va en cada pantalla.
 */
const TOPICS: Topic[] = [
  {
    id: 'intro',
    label: 'Introducción',
    icon: 'book',
    slides: [
      {
        id: 'what-is',
        label: '¿Qué es Blockchain?',
        layout: ONE,
        children: (
          <HudItem lazy>
            <WhatIsBlockchainCard className="h-full" />
          </HudItem>
        ),
      },
      {
        id: 'wallets',
        label: 'Carteras',
        layout: ONE,
        children: (
          <HudItem lazy>
            <WalletsCard className="h-full" />
          </HudItem>
        ),
      },
    ],
  },
  {
    id: 'concepts',
    label: 'Conceptos básicos',
    icon: 'bulb',
    slides: [
      {
        id: 'basic-concepts',
        label: 'Conceptos básicos',
        layout: ONE,
        children: (
          <HudItem lazy>
            <BasicConceptsCard className="h-full" />
          </HudItem>
        ),
      },
      {
        id: 'tokens',
        label: 'Criptomonedas y tokens',
        layout: ONE,
        children: (
          <HudItem lazy>
            <CryptoTokensCard className="h-full" />
          </HudItem>
        ),
      },
    ],
  },
  {
    id: 'structure',
    label: 'Estructura',
    icon: 'layers',
    slides: [
      {
        id: 'protection',
        label: '¿Cómo se protege la información?',
        layout: WIDER,
        children: (
          <HudItem lazy>
            <ProtectionCard className="h-full" />
          </HudItem>
        ),
      },
      {
        id: 'layers',
        label: 'Las 5 capas de Blockchain',
        layout: ONE,
        children: (
          <HudItem lazy>
            <LayersCard className="h-full" />
          </HudItem>
        ),
      },
    ],
  },
  {
    id: 'details',
    label: 'Detalles',
    icon: 'doc',
    slides: [
      {
        id: 'standards',
        label: 'Estándares de redes',
        layout: ONE,
        children: (
          <HudItem lazy>
            <NetworkStandardsCard className="h-full" />
          </HudItem>
        ),
      },
      {
        id: 'consensus',
        label: 'Pruebas de consenso',
        layout: WIDER,
        children: (
          <HudItem lazy>
            <ConsensusCard className="h-full" />
          </HudItem>
        ),
      },
    ],
  },
  {
    id: 'gold',
    label: 'El oro digital',
    icon: 'bitcoin',
    slides: [
      {
        id: 'bitcoin-gold',
        label: 'Bitcoin: el oro digital',
        layout: WIDER,
        children: (
          <HudItem lazy>
            <BitcoinGoldCard />
          </HudItem>
        ),
      },
    ],
  },
  {
    id: 'market',
    label: 'Estado del mercado',
    icon: 'bars',
    slides: [
      {
        id: 'market-status',
        label: 'Estado del mercado',
        layout: WIDER,
        children: (
          <HudItem lazy>
            <MarketStatusCard />
          </HudItem>
        ),
      },
    ],
  },
  {
    id: 'atlas',
    label: 'ATLAS',
    icon: 'globe',
    slides: [
      {
        id: 'atlas-simulation',
        label: 'ATLAS de simulación',
        layout: WIDE,
        minScale: 0.4, // es un tablero grande: si la ventana no alcanza, se reduce para que entre
        children: (
          <HudItem lazy>
            <BitcoinAtlas />
          </HudItem>
        ),
      },
    ],
  },
]

export const CryptoHud: React.FC<{ header: React.ReactNode }> = ({ header }) => (
  <>
    <BlockchainStyles />
    <TopicHud
      header={header}
      topics={TOPICS}
      label="Temas del análisis de criptomonedas"
      sidebarAction={<BackToAnalysisButton />}
      contentWidth="77.5rem" // el Atlas mide ~1232 px: así se ve sin reducirse
    />
  </>
)