import React from 'react'
import { BlockchainStyles } from './BlockchainStyles'
import { BasicConceptsCard } from './cards/BasicConceptsCard'
import { BitcoinGoldCard } from './cards/BitcoinGoldCard'
import { ConsensusCard } from './cards/ConsensusCard'
import { CryptoTokensCard } from './cards/CryptoTokensCard'
import { LayersCard } from './cards/LayersCard'
import { NetworkStandardsCard } from './cards/NetworkStandardsCard'
import { ProtectionCard } from './cards/ProtectionCard'
import { WalletsCard } from './cards/WalletsCard'
import { WhatIsBlockchainCard } from './cards/WhatIsBlockchainCard'

/**
 * Módulo Blockchain y criptomonedas (tarjetas 4.1 a 4.9).
 * Distribución en pantallas anchas:
 *   fila 1: 4.1 · 4.2        fila 2: 4.3 · 4.4 · 4.5
 *   fila 3: 4.6 · 4.7 · 4.8  fila 4: 4.9 (ancho completo)
 * En tabletas pasa a dos columnas y en móvil a una.
 */
export const BlockchainModule: React.FC = () => (
  <section aria-label="Blockchain y criptomonedas" className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
    <BlockchainStyles />

    <WhatIsBlockchainCard className="md:col-span-2 lg:col-span-6" index={0} />
    <BasicConceptsCard className="md:col-span-2 lg:col-span-6" index={1} />

    <ProtectionCard className="lg:col-span-4" index={0} />
    <CryptoTokensCard className="lg:col-span-4" index={1} />
    <WalletsCard className="md:col-span-2 lg:col-span-4" index={2} />

    <LayersCard className="lg:col-span-4" index={0} />
    <NetworkStandardsCard className="lg:col-span-4" index={1} />
    <ConsensusCard className="md:col-span-2 lg:col-span-4" index={2} />

    <BitcoinGoldCard className="md:col-span-2 lg:col-span-12" />
  </section>
)
