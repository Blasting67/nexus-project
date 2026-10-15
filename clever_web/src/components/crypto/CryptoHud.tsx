import React from 'react'
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
import { DockedHud } from '../hud/DockedHud'
import type { DockSection } from '../hud/DockedHud'
import { HudItem } from '../hud/HudSlide'
import { MarketStatusCard } from './MarketStatusCard'

/**
 * Secciones del análisis de criptomonedas, en orden.
 * Las tarjetas son las mismas de siempre; aquí solo se decide en qué sección aparece cada una.
 */
const SECTIONS: DockSection[] = [
  {
    id: 'intro',
    label: 'Introducción',
    children: (
      <>
        <HudItem lazy order={0}>
          <WhatIsBlockchainCard className="h-full" />
        </HudItem>
        <HudItem lazy order={1}>
          <WalletsCard className="h-full" />
        </HudItem>
      </>
    ),
  },
  {
    id: 'concepts',
    label: 'Conceptos básicos',
    children: (
      <>
        <HudItem lazy order={0}>
          <BasicConceptsCard className="h-full" />
        </HudItem>
        <HudItem lazy order={1}>
          <CryptoTokensCard className="h-full" />
        </HudItem>
      </>
    ),
  },
  {
    id: 'structure',
    label: 'Estructura',
    children: (
      <>
        <HudItem lazy order={0}>
          <ProtectionCard className="h-full" />
        </HudItem>
        <HudItem lazy order={1}>
          <LayersCard className="h-full" />
        </HudItem>
      </>
    ),
  },
  {
    id: 'details',
    label: 'Detalles',
    // la tabla de consensos necesita más ancho que los estándares de red
    layout: 'grid gap-5 lg:grid-cols-[2fr_3fr]',
    children: (
      <>
        <HudItem lazy order={0}>
          <NetworkStandardsCard className="h-full" />
        </HudItem>
        <HudItem lazy order={1}>
          <ConsensusCard className="h-full" />
        </HudItem>
      </>
    ),
  },
  {
    id: 'gold',
    label: 'El oro digital',
    layout: 'grid',
    children: (
      <HudItem lazy>
        <BitcoinGoldCard />
      </HudItem>
    ),
  },
  {
    id: 'market',
    label: 'Estado del mercado',
    layout: 'grid',
    children: (
      <HudItem lazy>
        <MarketStatusCard />
      </HudItem>
    ),
  },
  {
    id: 'atlas',
    label: 'ATLAS de SIMULACIÓN',
    layout: 'grid',
    minScale: 0.6, // es un tablero grande: se muestra en miniatura para que entre en pantalla
    children: (
      <HudItem lazy>
        <BitcoinAtlas />
      </HudItem>
    ),
  },
]

export const CryptoHud: React.FC = () => (
  <>
    <BlockchainStyles />
    <DockedHud label="Secciones del análisis de criptomonedas" sections={SECTIONS} />
  </>
)
