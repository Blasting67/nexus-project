import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { ACHIEVEMENTS, CATEGORIES } from '../data/catalog'
import { DEFAULT_BANNER_A, DEFAULT_BANNER_B, DEFAULT_CUSTOMIZATION } from '../data/profileCustomizationOptions'
import { ACCENT_COLORS, DEFAULT_ACCENT, THEME_OPTIONS } from '../data/themeOptions'
import type { ThemeOption } from '../data/themeOptions'
import { AvatarFrame, PROFILE_STYLES, ProfileBanner } from '../components/profile/ProfileVisuals'
import {
  loadProfileCustomization,
  resetProfileCustomization,
} from '../services/profileCustomizationService'
import type { ProfileCustomization } from '../types/profileCustomization'

const BIO_MAX = 160
const GOAL_MAX = 120
const NAME_MAX = 40

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
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })

const ThemePreviewCard: React.FC<{
  theme: ThemeOption
  selected: boolean
  onSelect: () => void
}> = ({ theme, selected, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    aria-pressed={selected}
    className={`group text-left rounded-xl border p-2.5 transition-all cursor-pointer hover:-translate-y-0.5 ${
      selected
        ? 'border-[var(--primary)] ring-2 ring-[var(--primary)] bg-[var(--surface-alt)]'
        : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-dim)]'
    }`}
  >
    <div
      className="relative h-20 rounded-lg overflow-hidden border border-black/10"
      style={{ background: theme.preview.background }}
    >
      <div
        className="absolute left-2.5 right-2.5 top-2.5 h-9 rounded-md border border-white/10 px-2 flex items-center justify-between"
        style={{ background: theme.preview.surface }}
      >
        <span className="text-[10px] font-bold" style={{ color: theme.preview.text }}>
          Aa
        </span>
        <span className="h-3.5 w-10 rounded-full" style={{ background: theme.preview.gradient }} />
      </div>
      <div className="absolute left-2.5 bottom-2.5 h-2 w-16 rounded-full opacity-70" style={{ background: theme.preview.gradient }} />
      {selected && (
        <span className="absolute right-2 bottom-2 w-5 h-5 rounded-full bg-[var(--primary)] text-[var(--primary-text)] flex items-center justify-center text-[10px]">
          <i className="fa-solid fa-check"></i>
        </span>
      )}
    </div>
    <div className="mt-2.5 px-0.5">
      <div className="text-xs font-bold text-[var(--text)]">{theme.name}</div>
      <div className="text-[10px] leading-snug text-[var(--text-muted)] mt-0.5">{theme.desc}</div>
    </div>
  </button>
)

export const CustomizationPage: React.FC = () => {
  const { user, updateUserProfile, showToast } = usePlatform()

  const [name, setName] = useState(user.name || '')
  const [bio, setBio] = useState(user.bio || '')
  const [featured, setFeatured] = useState(user.featuredAchievement || '')
  const [goal, setGoal] = useState(user.goal || '')
  const [interests, setInterests] = useState<string[]>(user.interests || [])
  const [isAvatarProcessing, setIsAvatarProcessing] = useState(false)
  const [isCoverProcessing, setIsCoverProcessing] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [customization, setCustomization] = useState<ProfileCustomization>(() =>
    loadProfileCustomization(user.username)
  )

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => user.achievements.includes(a.id))
  const displayName = user.name || user.username
  const initials = (displayName || 'U').slice(0, 2).toUpperCase()
  const hasXp = typeof user.xp === 'number' && user.xpToNext > 0
  const xpPercent = hasXp ? Math.min(100, Math.round((user.xp / user.xpToNext) * 100)) : 0

  const sameInterests =
    interests.length === (user.interests || []).length &&
    interests.every((id) => (user.interests || []).includes(id))

  const isDirty =
    name.trim() !== (user.name || '') ||
    bio.trim() !== (user.bio || '') ||
    featured !== (user.featuredAchievement || '') ||
    goal.trim() !== (user.goal || '') ||
    !sameInterests

  const currentTheme = THEME_OPTIONS.find((theme) => theme.id === user.theme)
  const themeAccent = currentTheme?.accent || DEFAULT_ACCENT
  const vibrantThemes = THEME_OPTIONS.filter((theme) => theme.group === 'vibrant')
  const classicThemes = THEME_OPTIONS.filter((theme) => theme.group === 'classic')

  const toggleInterest = (id: string) => {
    setInterests((current) => {
      if (current.includes(id)) {
        return current.length === 1 ? current : current.filter((item) => item !== id)
      }
      return [...current, id]
    })
  }

  const handleSaveProfile = () => {
    const cleanName = name.trim()
    if (!cleanName) {
      showToast('El nombre no puede estar vacío', 'error')
      return
    }
    if (interests.length === 0) {
      showToast('Elige al menos un tema de interés', 'error')
      return
    }
    updateUserProfile({
      name: cleanName,
      bio: bio.trim(),
      featuredAchievement: featured || null,
      goal: goal.trim(),
      interests,
    })
    showToast('Perfil actualizado', 'success')
  }

  const handleDiscardChanges = () => {
    setName(user.name || '')
    setBio(user.bio || '')
    setFeatured(user.featuredAchievement || '')
    setGoal(user.goal || '')
    setInterests(user.interests || [])
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setIsAvatarProcessing(true)
    try {
      const dataUrl = await resizeImage(file, 512)
      updateUserProfile({ avatar: dataUrl })
      showToast('Avatar actualizado', 'success')
    } catch {
      showToast('No se pudo procesar la imagen', 'error')
    } finally {
      setIsAvatarProcessing(false)
    }
  }

  const handleRemoveAvatar = () => {
    updateUserProfile({ avatar: null })
    showToast('Avatar eliminado', 'info')
  }

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setIsCoverProcessing(true)
    try {
      const dataUrl = await resizeImage(file, 1200)
      updateUserProfile({ cover: dataUrl })
      showToast('Banner actualizado', 'success')
    } catch {
      showToast('No se pudo procesar la imagen', 'error')
    } finally {
      setIsCoverProcessing(false)
    }
  }

  const handleRemoveCover = () => {
    updateUserProfile({ cover: null })
    showToast('Banner eliminado', 'info')
  }

  const handleThemeSelect = (theme: ThemeOption) => {
    if (theme.accent) {
      updateUserProfile({ theme: theme.id, accentColor: theme.accent })
    } else {
      updateUserProfile({ theme: theme.id })
    }
    showToast(`Tema ${theme.name} aplicado`, 'success')
  }

  const handleAccentSelect = (color: string) => {
    updateUserProfile({ accentColor: color })
  }

  const handleResetAccent = () => {
    updateUserProfile({ accentColor: themeAccent })
    showToast('Acento restablecido al del tema', 'info')
  }

  const handleDownloadData = () => {
    const safeUser = Object.fromEntries(Object.entries(user).filter(([key]) => !key.startsWith('_')))
    const payload = {
      exportedAt: new Date().toISOString(),
      profile: safeUser,
      customization: loadProfileCustomization(user.username),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `clever-datos-${user.username || 'perfil'}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast('Datos descargados', 'success')
  }

  const handleResetCustomization = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    resetProfileCustomization(user.username)
    setCustomization(DEFAULT_CUSTOMIZATION)
    setConfirmReset(false)
    showToast('Personalización del perfil restablecida', 'success')
  }

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]'

  const sectionTitle = 'text-xs font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-2'

  const bannerColorA = customization.bannerColorA || DEFAULT_BANNER_A
  const bannerColorB = customization.bannerColorB || DEFAULT_BANNER_B
  const frameColor = customization.frameColor || 'var(--primary)'

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      <style>{PROFILE_STYLES}</style>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">Personalización</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Datos de perfil, tema visual, color de acento y avatar de cuenta.
          </p>
        </div>
        <Link to="/perfil" className="platform-btn-secondary py-1.5 px-3 text-xs self-start sm:self-auto">
          <i className="fa-solid fa-user"></i>
          Ver mi perfil
        </Link>
      </div>

      <div className="platform-card overflow-hidden">
        <ProfileBanner
          style={customization.bannerStyle}
          colorA={bannerColorA}
          colorB={bannerColorB}
          speed={customization.bannerSpeed}
          cover={user.cover || undefined}
          className="h-24 sm:h-28"
        />
        <div className="px-5 pb-5">
          <div className="flex items-end gap-4 -mt-12">
            <div className="flex-shrink-0">
              <AvatarFrame
                src={user.avatar || undefined}
                initials={initials}
                alt={`Avatar de ${displayName}`}
                shape={customization.avatarShape}
                frame={customization.frameStyle}
                frameColor={frameColor}
                showLevelRing={customization.showLevelRing && hasXp}
                progress={xpPercent}
                level={user.level}
                size={76}
              />
            </div>
            <div className="min-w-0 pb-2">
              <div className="text-lg font-extrabold text-[var(--text)] leading-tight truncate">{displayName}</div>
              <div className="text-xs font-mono text-[var(--text-muted)]">@{user.username}</div>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-[var(--text-muted)]">
            Vista previa en vivo: así se verá tu perfil con el tema, el acento y las imágenes que elijas aquí.
          </p>
        </div>
      </div>

      <div className="platform-card p-6 space-y-5">
        <h2 className={sectionTitle}>
          <i className="fa-solid fa-id-card text-[var(--primary)]"></i>
          Datos del perfil
        </h2>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="profile-name" className="text-xs text-[var(--text-muted)]">
              Nombre visible
            </label>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              {name.length}/{NAME_MAX}
            </span>
          </div>
          <input
            id="profile-name"
            type="text"
            value={name}
            maxLength={NAME_MAX}
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
          <div className="flex items-center justify-between">
            <label htmlFor="profile-goal" className="text-xs text-[var(--text-muted)]">
              Meta de aprendizaje
            </label>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              {goal.length}/{GOAL_MAX}
            </span>
          </div>
          <input
            id="profile-goal"
            type="text"
            value={goal}
            maxLength={GOAL_MAX}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Qué quieres lograr en la plataforma"
            className={inputClass}
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

        <div className="space-y-2">
          <div className="text-xs text-[var(--text-muted)]">Temas de interés</div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const active = interests.includes(category.id)
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleInterest(category.id)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-text)]'
                      : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                  }`}
                >
                  <i className={category.icon}></i>
                  {category.name}
                </button>
              )
            })}
          </div>
          <p className="text-[10px] text-[var(--text-muted)]">
            Tu misión diaria y tu ruta de estudio se adaptan a estos temas. Debes mantener al menos uno.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={handleDiscardChanges}
              className="platform-btn-secondary py-1.5 px-4 text-xs"
            >
              Descartar
            </button>
          )}
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={!isDirty}
            className="platform-btn-primary py-1.5 px-4 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-floppy-disk"></i>
            Guardar cambios
          </button>
        </div>
      </div>

      <div className="platform-card p-6 space-y-4">
        <h2 className={sectionTitle}>
          <i className="fa-solid fa-shield-halved text-[var(--primary)]"></i>
          Cuenta
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Usuario</div>
            <div className="text-sm font-semibold text-[var(--text)] font-mono">@{user.username}</div>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Correo</div>
            <div className="text-sm font-semibold text-[var(--text)] truncate">{user.email}</div>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] px-3 py-2.5 sm:col-span-2">
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Miembro desde</div>
            <div className="text-sm font-semibold text-[var(--text)]">
              {new Date(user.createdAt).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>
        <p className="text-[10px] text-[var(--text-muted)]">
          El usuario y el correo están vinculados a tu cuenta y no se pueden cambiar desde aquí por ahora.
        </p>
      </div>

      <div className="platform-card p-6 space-y-4">
        <h2 className={sectionTitle}>
          <i className="fa-solid fa-camera text-[var(--primary)]"></i>
          Foto de perfil
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-shrink-0">
            <AvatarFrame
              src={user.avatar || undefined}
              initials={initials}
              alt="Avatar"
              shape={customization.avatarShape}
              frame={customization.frameStyle}
              frameColor={frameColor}
              showLevelRing={false}
              progress={0}
              level={user.level}
              size={64}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <label className="platform-btn-primary py-1.5 px-3 text-xs cursor-pointer">
              {isAvatarProcessing ? (
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              ) : (
                <i className="fa-solid fa-upload"></i>
              )}
              <span>Cambiar imagen</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isAvatarProcessing}
                className="hidden"
              />
            </label>

            {user.avatar && (
              <button onClick={handleRemoveAvatar} className="platform-btn-secondary py-1.5 px-3 text-xs text-rose-500">
                Eliminar
              </button>
            )}

            <Link to="/perfil?studio=avatar" className="platform-btn-secondary py-1.5 px-3 text-xs">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              Forma y marco
            </Link>
          </div>
        </div>
      </div>

      <div className="platform-card p-6 space-y-4">
        <h2 className={sectionTitle}>
          <i className="fa-solid fa-panorama text-[var(--primary)]"></i>
          Banner del perfil
        </h2>

        <ProfileBanner
          style={customization.bannerStyle}
          colorA={bannerColorA}
          colorB={bannerColorB}
          speed={customization.bannerSpeed}
          cover={user.cover || undefined}
          className="h-24 sm:h-28 w-full rounded-lg border border-[var(--border)]"
        />

        <div className="flex flex-wrap items-center gap-2">
          <label className="platform-btn-primary py-1.5 px-3 text-xs cursor-pointer">
            {isCoverProcessing ? (
              <i className="fa-solid fa-circle-notch fa-spin"></i>
            ) : (
              <i className="fa-solid fa-image"></i>
            )}
            <span>{user.cover ? 'Cambiar imagen' : 'Subir imagen'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              disabled={isCoverProcessing}
              className="hidden"
            />
          </label>

          {user.cover && (
            <button onClick={handleRemoveCover} className="platform-btn-secondary py-1.5 px-3 text-xs text-rose-500">
              Eliminar
            </button>
          )}

          <Link to="/perfil?studio=banner" className="platform-btn-secondary py-1.5 px-3 text-xs">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            Estilo animado y colores
          </Link>
        </div>

        <p className="text-[10px] text-[var(--text-muted)]">
          Tu imagen se muestra cuando eliges el estilo Mi imagen. Los demás estilos son animados y toman los colores
          del tema. Se recomienda una imagen horizontal (3:1).
        </p>
      </div>

      <div className="platform-card p-6 space-y-5">
        <h2 className={sectionTitle}>
          <i className="fa-solid fa-palette text-[var(--primary)]"></i>
          Tema visual
        </h2>

        <div className="space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Colecciones con degradados</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {vibrantThemes.map((theme) => (
              <ThemePreviewCard
                key={theme.id}
                theme={theme}
                selected={user.theme === theme.id}
                onSelect={() => handleThemeSelect(theme)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Clásicos</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {classicThemes.map((theme) => (
              <ThemePreviewCard
                key={theme.id}
                theme={theme}
                selected={user.theme === theme.id}
                onSelect={() => handleThemeSelect(theme)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="platform-card p-6 space-y-4">
        <h2 className={sectionTitle}>
          <i className="fa-solid fa-droplet text-[var(--primary)]"></i>
          Color de acento
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {ACCENT_COLORS.map((color) => {
            const isSelected = user.accentColor === color

            return (
              <button
                key={color}
                onClick={() => handleAccentSelect(color)}
                style={{ backgroundColor: color }}
                aria-label={`Color de acento ${color}`}
                className={`w-8 h-8 rounded-lg transition-transform cursor-pointer flex items-center justify-center hover:scale-110 ${
                  isSelected ? 'scale-110 ring-2 ring-offset-2 ring-offset-[var(--surface)] ring-[var(--text)]' : ''
                }`}
              >
                {isSelected && <i className="fa-solid fa-check text-white text-[10px]"></i>}
              </button>
            )
          })}

          <label
            className="relative w-8 h-8 rounded-lg border border-dashed border-[var(--text-dim)] flex items-center justify-center cursor-pointer text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]"
            title="Color personalizado"
          >
            <i className="fa-solid fa-eye-dropper text-xs"></i>
            <input
              type="color"
              value={/^#[0-9a-fA-F]{6}$/.test(user.accentColor || '') ? (user.accentColor as string) : DEFAULT_ACCENT}
              onChange={(e) => handleAccentSelect(e.target.value)}
              aria-label="Color de acento personalizado"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button type="button" className="platform-btn-primary py-1.5 px-3 text-xs">
            <i className="fa-solid fa-bolt"></i>
            Así se ve un botón
          </button>
          <button type="button" onClick={handleResetAccent} className="platform-btn-secondary py-1.5 px-3 text-xs">
            <i className="fa-solid fa-rotate-left"></i>
            Usar el acento del tema
          </button>
        </div>
      </div>

      <div className="platform-card p-6 space-y-4">
        <h2 className={sectionTitle}>
          <i className="fa-solid fa-database text-[var(--primary)]"></i>
          Tus datos
        </h2>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleDownloadData} className="platform-btn-secondary py-1.5 px-3 text-xs">
            <i className="fa-solid fa-download"></i>
            Descargar mis datos
          </button>
          <button
            type="button"
            onClick={handleResetCustomization}
            onBlur={() => setConfirmReset(false)}
            className={`platform-btn-secondary py-1.5 px-3 text-xs ${confirmReset ? 'text-rose-500 border-rose-500' : ''}`}
          >
            <i className="fa-solid fa-rotate-left"></i>
            {confirmReset ? 'Confirmar restablecer' : 'Restablecer estilo del perfil'}
          </button>
        </div>
        <p className="text-[10px] text-[var(--text-muted)]">
          Restablecer solo borra el banner animado, el marco, el estado y la vitrina de tu perfil. Tu progreso y tus
          datos de cuenta no se tocan.
        </p>
      </div>
    </div>
  )
}