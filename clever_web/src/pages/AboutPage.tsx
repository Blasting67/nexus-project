import React from 'react'
import { MemberCard } from '../components/about/MemberCard'
import { LEAD, TEAM } from '../components/about/members'
import '../components/about/about.css'

export const AboutPage: React.FC = () => (
  <div className="mx-auto w-full max-w-6xl px-0 py-4 sm:px-2 lg:py-8">
    <header className="mb-8 text-center lg:mb-10">
      <h1 className="ab-title">Conócenos</h1>
      <p className="ab-subtitle">El equipo detrás de Clever.</p>
    </header>

    <section aria-label="Equipo de Clever">
      <div className="ab-lead">
        <MemberCard member={LEAD} />
      </div>
      <div className="ab-grid">
        {TEAM.map((member) => (
          <MemberCard key={member.slug} member={member} />
        ))}
      </div>
    </section>
  </div>
)
