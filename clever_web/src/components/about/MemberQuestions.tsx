import React from 'react'
import { QUESTIONS, QUESTIONS_TITLE } from './types'
import type { TeamMember } from './types'

const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)

export const MemberQuestions: React.FC<{ member: TeamMember }> = ({ member }) => (
  <section aria-labelledby="mb-questions" className="mb-questions">
    <h2 id="mb-questions" className="mb-questions-title">
      {QUESTIONS_TITLE}
    </h2>
    <div className="mb-qa-list">
      {QUESTIONS.map((question) => (
        <article key={question.id} className="mb-qa">
          <h3 className="mb-q">{question.label}</h3>
          <div className="mb-a">
            {paragraphs(member.answers[question.id]).map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
        </article>
      ))}
    </div>
  </section>
)
