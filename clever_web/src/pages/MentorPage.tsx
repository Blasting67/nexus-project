import React, { useState } from 'react'
import { usePlatform } from '../context/PlatformContext'
import { CATEGORIES, MENTOR_SUGGESTIONS, MODULES_BY_CATEGORY } from '../data/catalog'
import { useSearchParams } from 'react-router-dom'

export const MentorPage: React.FC = () => {
  const { user, mentorMessages, sendMentorMessage } = usePlatform()
  const [inputText, setInputText] = useState('')
  const [searchParams] = useSearchParams()
  const category = CATEGORIES.find((item) => item.id === searchParams.get('cat'))
  const suggestions = category
    ? (MODULES_BY_CATEGORY[category.id] || []).slice(0, 3).map((title) => `En ${category.name}, explícame ${title}`)
    : MENTOR_SUGGESTIONS

  const handleSend = () => {
    if (!inputText.trim()) return
    sendMentorMessage(inputText.trim())
    setInputText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      <div className="border-b border-[var(--border)] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
          Mentor IA{category ? ` · ${category.name}` : ''}
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          {category ? `Repasa las lecciones y consulta tus dudas sobre ${category.name}.` : 'Asistente para consultar tus dudas sobre los caminos de aprendizaje.'}
        </p>
      </div>

      <div className="platform-card h-[520px] flex flex-col overflow-hidden">
        <div className="px-5 py-3 bg-[var(--bg-alt)] border-b border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
          <span>CLEVER MENTOR</span>
          <span>Nivel {user.level} ({user.levelLabel})</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {mentorMessages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3.5 rounded text-xs leading-relaxed ${
                  m.from === 'user'
                    ? 'bg-[var(--primary)] text-[var(--primary-text)] font-medium'
                    : 'bg-[var(--bg-alt)] text-[var(--text)] border border-[var(--border)]'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-alt)] space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {suggestions.map((sugg, idx) => (
              <button
                key={idx}
                onClick={() => sendMentorMessage(sugg)}
                className="px-2.5 py-1 rounded text-[11px] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)] whitespace-nowrap cursor-pointer"
              >
                {sugg}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu consulta aquí..."
              className="platform-input text-xs"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="platform-btn-primary py-2 px-4 text-xs font-semibold disabled:opacity-40"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
