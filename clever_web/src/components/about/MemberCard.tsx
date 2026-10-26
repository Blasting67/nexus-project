import React from 'react'
import { Link } from 'react-router-dom'
import { warmMember } from './preload'
import { CAREER } from './types'
import type { TeamMember } from './types'

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter((part) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(part))
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

export const MemberCard: React.FC<{ member: TeamMember }> = ({ member }) => (
  <Link
    to={`/conocenos/${member.slug}`}
    aria-label={`Ver perfil de ${member.name}`}
    onPointerEnter={() => warmMember(member)}
    onFocus={() => warmMember(member)}
    style={{ '--m': member.color } as React.CSSProperties}
    className="ab-card"
  >
    <span className="ab-photo">
      {member.photo ? (
        <img src={member.photo} alt="" loading="lazy" decoding="async" />
      ) : (
        <span className="ab-initials" aria-hidden="true">
          {initialsOf(member.name)}
        </span>
      )}
    </span>
    <span className="ab-body">
      <span className="ab-name">{member.name}</span>
      <span className="ab-career">{CAREER}</span>
      <span className="ab-desc">{member.description}</span>
    </span>
    <span className="ab-more" aria-hidden="true">
      Ver perfil
      <i className="fa-solid fa-arrow-right"></i>
    </span>
  </Link>
)
