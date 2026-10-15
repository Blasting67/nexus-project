import React, { useState } from 'react'
import { usePlatform } from '../context/PlatformContext'
import { ACHIEVEMENTS } from '../data/catalog'

const THEMES = [
  { id: 'light', name: 'Light Clean', desc: 'Fondo claro y espacioso' },
  { id: 'minimal', name: 'Minimal Mono', desc: 'Monocromo neutral y limpio' },
  { id: 'dark', name: 'Dark Slate', desc: 'Fondo oscuro pizarra' },
]

const ACCENT_COLORS = ['#0284c7', '#0f766e', '#6366f1', '#16a34a', '#d97706']

const BIO_MAX = 160

/**
 * Reduce la imagen antes de guardarla. Los datos viven en localStorage (~5 MB en total),
 * así que un banner sin comprimir podría llenar el espacio y hacer que falle el guardado.
 */
const resizeImage = (file: File, maxWidth: number, quality = 0.82): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Imagen no válida'))
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas no disponible'))
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })

export const CustomizationPage: React.FC = () => {
  const { user, setTheme, setAccentColor, updateUserProfile, showToast } = usePlatform()

  const [name, setName] = useState(user.name || '')
  const [bio, setBio] = useState(user.bio || '')
  const [featured, setFeatured] = useState(user.featuredAchievement || '')

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => user.achievements.includes(a.id))

  const isDirty =
    name.trim() !== (user.name || '') ||
    bio.trim() !== (user.bio || '') ||
    featured !== (user.featuredAchievement || '')

  const handleSaveProfile = () => {
    const cleanName = name.trim()
    if (!cleanName) {
      showToast('El nombre no puede estar vacío', 'error')
      return
    }
    updateUserProfile({
      name: cleanName,
      bio: bio.trim(),
      featuredAchievement: featured || null,
    })
    showToast('Perfil actualizado', 'success')
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      updateUserProfile({ avatar: reader.result as string })
      showToast('Avatar actualizado', 'success')
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    updateUserProfile({ avatar: null })
    showToast('Avatar eliminado', 'info')
  }

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const dataUrl = await resizeImage(file, 1200)
      updateUserProfile({ cover: dataUrl })
      showToast('Banner actualizado', 'success')
    } catch {
      showToast('No se pudo procesar la imagen', 'error')
    }
  }

  const handleRemoveCover = () => {
    updateUserProfile({ cover: null })
    showToast('Banner eliminado', 'info')
  }

  const inputClass =
    'w-full px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]'

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-8">
      <div className="border-b border-[var(--border)] pb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
          Personalización
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Ajustes de perfil, tema visual y avatar de cuenta.
        </p>
      </div>

      {/* Datos del perfil */}
      <div className="platform-card p-6 space-y-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
          Datos del Perfil
        </h2>

        <div className="space-y-1.5">
          <label htmlFor="profile-name" className="text-xs text-[var(--text-muted)]">
            Nombre visible
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="profile-bio" className="text-xs text-[var(--text-muted)]">
              Bio
            </label>
            <span
              className={`text-[10px] font-mono ${
                bio.length >= BIO_MAX ? 'text-rose-500' : 'text-[var(--text-muted)]'
              }`}
            >
              {bio.length}/{BIO_MAX}
            </span>
          </div>
          <textarea
            id="profile-bio"
            value={bio}
            maxLength={BIO_MAX}
            rows={3}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Cuéntale a la comunidad qué estás aprendiendo."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="profile-featured" className="text-xs text-[var(--text-muted)]">
            Título destacado
          </label>
          {unlockedAchievements.length > 0 ? (
            <select
              id="profile-featured"
              value={featured}
              onChange={(e) => setFeatured(e.target.value)}
              className={inputClass}
            >
              <option value="">Automático (último logro desbloqueado)</option>
              {unlockedAchievements.map((ach) => (
                <option key={ach.id} value={ach.id}>
                  {ach.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-xs text-[var(--text-muted)]">
              Desbloquea tu primer logro para mostrarlo junto a tu nombre.
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={!isDirty}
            className="platform-btn-primary py-1.5 px-4 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar cambios
          </button>
        </div>
      </div>

      {/* Foto de perfil */}
      <div className="platform-card p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
          Foto de Perfil
        </h2>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--text)] font-bold flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (user.name || user.username || 'U').slice(0, 2).toUpperCase()
            )}
          </div>

          <div className="flex gap-2">
            <label className="platform-btn-primary py-1.5 px-3 text-xs cursor-pointer">
              <span>Cambiar imagen</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>

            {user.avatar && (
              <button
                onClick={handleRemoveAvatar}
                className="platform-btn-secondary py-1.5 px-3 text-xs text-rose-500"
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="platform-card p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
          Banner del Perfil
        </h2>

        <div
          className="h-24 sm:h-28 w-full rounded border border-[var(--border)]"
          style={
            user.cover
              ? { backgroundImage: `url(${user.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : {
                  backgroundImage:
                    'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 35%, var(--bg-alt)))',
                }
          }
          aria-label="Vista previa del banner"
        />

        <div className="flex items-center gap-3">
          <label className="platform-btn-primary py-1.5 px-3 text-xs cursor-pointer">
            <span>{user.cover ? 'Cambiar banner' : 'Subir banner'}</span>
            <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
          </label>

          {user.cover && (
            <button
              onClick={handleRemoveCover}
              className="platform-btn-secondary py-1.5 px-3 text-xs text-rose-500"
            >
              Eliminar
            </button>
          )}
        </div>

        <p className="text-[10px] text-[var(--text-muted)]">
          Sin imagen, se usa un degradado de tu color de acento. Se recomienda una imagen
          horizontal (3:1).
        </p>
      </div>

      {/* Tema visual */}
      <div className="platform-card p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
          Tema Visual
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {THEMES.map((th) => {
            const isSelected = user.theme === th.id

            return (
              <button
                key={th.id}
                onClick={() => setTheme(th.id)}
                className={`p-3 rounded border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--surface-alt)] font-semibold'
                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-dim)]'
                }`}
              >
                <div className="text-xs text-[var(--text)]">{th.name}</div>
                <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{th.desc}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Color de acento */}
      <div className="platform-card p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
          Color de Acento
        </h2>

        <div className="flex gap-3">
          {ACCENT_COLORS.map((color) => {
            const isSelected = user.accentColor === color

            return (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                style={{ backgroundColor: color }}
                aria-label={`Color de acento ${color}`}
                className={`w-7 h-7 rounded transition-transform cursor-pointer flex items-center justify-center ${
                  isSelected ? 'scale-110 ring-2 ring-[var(--text)]' : ''
                }`}
              >
                {isSelected && <i className="fa-solid fa-check text-white text-[10px]"></i>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}