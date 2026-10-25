import { photosFor } from './photos'
import type { MemberInput, TeamMember } from './types'

export const defineMember = (input: MemberInput): TeamMember => ({ ...input, ...photosFor(input.slug) })
