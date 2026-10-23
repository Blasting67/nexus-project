import React from 'react'
import { AnalysisThemeScope } from '../analysis/AnalysisThemeScope'
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

const ONE = 'mx-auto grid w-full max-w-[62rem]'
const WIDER = 'mx-auto grid w-full max-w-[72rem]'
const WIDE = 'grid w-full'

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
        minScale: 0.4,
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
  <AnalysisThemeScope>
    <BlockchainStyles />
    <TopicHud
      header={header}
      topics={TOPICS}
      label="Temas del análisis de criptomonedas"
      sidebarAction={<BackToAnalysisButton />}
      contentWidth="77.5rem"
    />
  </AnalysisThemeScope>
)