import React from 'react'
import { MARKETS } from '../HudData'
import { HudCard } from '../HudCard'
import { HudRows } from '../HudRows'

export const MarketsCard: React.FC = () => (
  <HudCard title="Mercados donde se opera" icon="globe">
    <HudRows items={MARKETS} label="Mercados donde se opera" />
  </HudCard>
)