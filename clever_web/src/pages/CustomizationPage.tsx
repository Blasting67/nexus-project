import React from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'

const SECTION_TO_TAB: Record<string, string> = {
  profile: 'datos',
  avatar: 'datos',
  account: 'datos',
  banner: 'diseno',
  appearance: 'tema',
}

export const CustomizationPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const section = searchParams.get('seccion') || ''
  const tab = SECTION_TO_TAB[section] || 'diseno'
  return <Navigate to={`/perfil?estudio=${tab}`} replace />
}
