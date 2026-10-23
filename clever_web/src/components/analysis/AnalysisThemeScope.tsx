import React, { useEffect } from 'react'
import './analysisTheme.css'

const PORTAL_CLASS = 'analysis-theme-portal'

export const AnalysisThemeScope: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    document.body.classList.add(PORTAL_CLASS)
    return () => document.body.classList.remove(PORTAL_CLASS)
  }, [])

  return <div className="analysis-theme contents">{children}</div>
}
