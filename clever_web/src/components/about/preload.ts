import type { TeamMember } from './types'

export const loadMemberPage = () => import('../../pages/MemberPage')

const warmed = new Set<string>()

export const warmMember = (member: TeamMember) => {
  if (warmed.has(member.slug)) return
  warmed.add(member.slug)
  void loadMemberPage()
  if (member.detailPhoto) {
    const img = new Image()
    img.decoding = 'async'
    img.src = member.detailPhoto
  }
}
