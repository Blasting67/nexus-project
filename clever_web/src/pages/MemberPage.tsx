import React, { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { MemberDetail } from '../components/about/MemberDetail'
import { MemberQuestions } from '../components/about/MemberQuestions'
import { MEMBERS, findMember } from '../components/about/members'
import { warmMember } from '../components/about/preload'
import '../components/about/about.css'

export const MemberPage: React.FC = () => {
  const { slug } = useParams()
  const member = findMember(slug)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!member) return
    const previous = document.title
    document.title = `${member.name} · Clever`
    return () => {
      document.title = previous
    }
  }, [member])

  if (!member) return <Navigate to="/conocenos" replace />

  const index = MEMBERS.indexOf(member)
  const prev = MEMBERS[(index - 1 + MEMBERS.length) % MEMBERS.length]
  const next = MEMBERS[(index + 1) % MEMBERS.length]

  return (
    <div style={{ '--m': member.color } as React.CSSProperties} className="mb-page">
      <Link to="/conocenos" className="mb-back">
        <i className="fa-solid fa-arrow-left"></i>
        Volver al equipo
      </Link>

      <MemberDetail key={member.slug} member={member} />

      <MemberQuestions member={member} />

      <nav aria-label="Otros integrantes" className="mb-pager">
        <Link to={`/conocenos/${prev.slug}`} onPointerEnter={() => warmMember(prev)} className="mb-pager-link">
          <i className="fa-solid fa-arrow-left"></i>
          <span>
            <span className="mb-pager-hint">Anterior</span>
            <span className="mb-pager-name">{prev.name}</span>
          </span>
        </Link>
        <Link to={`/conocenos/${next.slug}`} onPointerEnter={() => warmMember(next)} className="mb-pager-link mb-pager-next">
          <span>
            <span className="mb-pager-hint">Siguiente</span>
            <span className="mb-pager-name">{next.name}</span>
          </span>
          <i className="fa-solid fa-arrow-right"></i>
        </Link>
      </nav>
    </div>
  )
}
