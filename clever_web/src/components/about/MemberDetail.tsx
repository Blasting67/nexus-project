import React, { useState } from 'react'
import { initialsOf } from './MemberCard'
import { CAREER } from './types'
import type { TeamMember } from './types'

export const MemberDetail: React.FC<{ member: TeamMember }> = ({ member }) => {
  const [showEmail, setShowEmail] = useState(false)
  const initials = initialsOf(member.name)

  return (
    <section aria-labelledby="mb-name" className="mb-hero">
      <div className="mb-portrait">
        <div aria-hidden="true" className="mb-arch">
          <span className="mb-watermark">{initials}</span>
        </div>
        {member.detailPhoto ? (
          <img src={member.detailPhoto} alt={member.name} decoding="async" fetchPriority="high" className="mb-photo" />
        ) : (
          <span aria-hidden="true" className="mb-initials">
            {initials}
          </span>
        )}
      </div>

      <div className="mb-info">
        <h1 id="mb-name" className="mb-name">
          {member.name}
        </h1>
        <span aria-hidden="true" className="mb-rule" />
        <p className="mb-role">{CAREER}</p>
        <p className="mb-bio">{member.description}</p>

        <div className="mb-actions">
          <button
            type="button"
            disabled={!member.email}
            aria-expanded={showEmail}
            onClick={() => setShowEmail((v) => !v)}
            className="mb-btn mb-btn-primary"
          >
            <i className="fa-solid fa-envelope"></i>
            Correo
          </button>
          <a
            href={member.linkedin || undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!member.linkedin}
            className="mb-btn mb-btn-ghost"
          >
            <i className="fa-brands fa-linkedin"></i>
            LinkedIn
          </a>
        </div>

        {showEmail && member.email && (
          <a href={`mailto:${member.email}`} className="mb-mail">
            <i className="fa-regular fa-envelope"></i>
            {member.email}
          </a>
        )}
      </div>
    </section>
  )
}
