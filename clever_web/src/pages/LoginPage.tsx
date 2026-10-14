import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'

export const LoginPage: React.FC = () => {
  const { login } = usePlatform()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim() || !password) return
    setIsSubmitting(true)
    try {
      const ok = await login(identifier.trim(), password)
      if (ok) {
        navigate('/')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto py-16">
      <div className="platform-card p-6 space-y-6">
        <div>
          <h1 className="text-lg font-bold text-[var(--text)]">
            Iniciar Sesión
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Accede con tu usuario o correo registrado en cleverkor_db.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Usuario o Correo
            </label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin o tu_usuario"
              className="platform-input"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              disabled={isSubmitting}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="platform-input"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full platform-btn-primary py-2 text-xs font-semibold justify-center disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin mr-1.5"></i>
                Validando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
          ¿Sin cuenta?{' '}
          <Link to="/register" className="text-[var(--primary)] hover:underline font-medium">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  )
}
