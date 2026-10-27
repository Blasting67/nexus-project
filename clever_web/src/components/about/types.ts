export const CAREER = 'Ingeniero en Sistemas y Negocios Digitales'

export const QUESTIONS_TITLE = 'Algunas preguntas'

export const QUESTIONS = [
  { id: 'personal', label: 'Cuéntanos de ti' },
  { id: 'carrera', label: '¿Cómo supiste que esa era la carrera para ti?' },
  { id: 'motivacion', label: '¿Qué te motiva a seguir?' },
  { id: 'consejo', label: '¿Qué consejo le darías a alguien que empiece en el mundo del desarrollo o a invertir?' },
] as const

export type QuestionId = (typeof QUESTIONS)[number]['id']

export interface MemberInput {
  slug: string
  name: string
  color: string
  career?: string
  description: string
  email: string
  linkedin: string
  answers: Record<QuestionId, string>
}

export interface TeamMember extends MemberInput {
  photo?: string
  detailPhoto?: string
}
