import React from 'react'
import { Link } from 'react-router-dom'
import {
  AVATAR_SHAPES,
  BANNER_PRESETS,
  BANNER_STYLES,
  DEFAULT_BANNER_A,
  DEFAULT_BANNER_B,
  FRAME_COLORS,
  FRAME_STYLES,
  MAX_PINNED_ACHIEVEMENTS,
  MAX_STATUS_LENGTH,
  STAT_OPTIONS,
  STATUS_ICONS,
  STATUS_SUGGESTIONS,
} from '../../data/profileCustomizationOptions'
import type { ProfileCustomization, StatId } from '../../types/profileCustomization'
import { getShapeStyle } from './ProfileVisuals'

export type StudioTabId = 'banner' | 'avatar' | 'status' | 'showcase' | 'effects'

export const STUDIO_TAB_IDS: StudioTabId[] = ['banner', 'avatar', 'status', 'showcase', 'effects']

const STUDIO_TABS: { id: StudioTabId; label: string; icon: string }[] = [
  { id: 'banner', label: 'Banner', icon: 'fa-solid fa-panorama' },
  { id: 'avatar', label: 'Avatar', icon: 'fa-solid fa-user-astronaut' },
  { id: 'status', label: 'Estado', icon: 'fa-solid fa-comment-dots' },
  { id: 'showcase', label: 'Vitrina', icon: 'fa-solid fa-trophy' },
  { id: 'effects', label: 'Efectos', icon: 'fa-solid fa-wand-magic-sparkles' },
]

interface ToggleProps {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  description?: string
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, description }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="w-full flex items-center justify-between gap-3 py-2 text-left cursor-pointer"
  >
    <span>
      <span className="block text-xs font-bold text-[var(--text)]">{label}</span>
      {description && <span className="block text-[11px] text-[var(--text-muted)]">{description}</span>}
    </span>
    <span
      className={`relative w-9 h-5 rounded-full flex-shrink-0 transition-colors ${
        checked ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-4' : ''
        }`}
      />
    </span>
  </button>
)

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{children}</div>
)

const tileClass = (active: boolean) =>
  `flex flex-col items-center justify-center gap-1.5 rounded-lg border px-2 py-3 text-[11px] font-semibold transition-all cursor-pointer ${
    active
      ? 'border-[var(--primary)] bg-[var(--bg-alt)] text-[var(--primary)]'
      : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]'
  }`

interface UnlockedAchievement {
  id: string
  name: string
}

interface ProfileStudioProps {
  open: boolean
  tab: StudioTabId
  onTabChange: (tab: StudioTabId) => void
  draft: ProfileCustomization
  onChange: (patch: Partial<ProfileCustomization>) => void
  onSave: () => void
  onReset: () => void
  onClose: () => void
  isDirty: boolean
  confirmDiscard: boolean
  onDiscard: () => void
  onKeepEditing: () => void
  unlockedAchievements: UnlockedAchievement[]
  hasCover: boolean
}

export const ProfileStudio: React.FC<ProfileStudioProps> = ({
  open,
  tab,
  onTabChange,
  draft,
  onChange,
  onSave,
  onReset,
  onClose,
  isDirty,
  confirmDiscard,
  onDiscard,
  onKeepEditing,
  unlockedAchievements,
  hasCover,
}) => {
  const toggleStat = (id: StatId) => {
    const has = draft.visibleStats.includes(id)
    if (has && draft.visibleStats.length === 1) return
    onChange({
      visibleStats: has ? draft.visibleStats.filter((s) => s !== id) : [...draft.visibleStats, id],
    })
  }

  const togglePinned = (id: string) => {
    const has = draft.pinnedAchievements.includes(id)
    if (!has && draft.pinnedAchievements.length >= MAX_PINNED_ACHIEVEMENTS) return
    onChange({
      pinnedAchievements: has
        ? draft.pinnedAchievements.filter((a) => a !== id)
        : [...draft.pinnedAchievements, id],
    })
  }

  const colorInputValue = (value: string) => (value ? value : '#0a84c6')

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/30 sm:hidden" onClick={onClose} aria-hidden="true" />}

      <aside
        aria-hidden={!open}
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[400px] bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div>
            <h2 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles text-[var(--primary)]"></i>
              Estudio de perfil
            </h2>
            <p className="text-[11px] text-[var(--text-muted)]">Los cambios se ven en vivo en tu perfil.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar estudio de perfil"
            className="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {confirmDiscard && (
          <div className="mx-4 mt-4 rounded-lg border border-[var(--warning)] bg-[var(--warning-bg)] p-3 space-y-2.5">
            <p className="text-xs font-semibold text-[var(--text)] flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation text-[var(--warning)]"></i>
              Tienes cambios sin guardar
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={onSave} className="platform-btn-primary py-1.5 px-3 text-xs cursor-pointer">
                Guardar
              </button>
              <button type="button" onClick={onDiscard} className="platform-btn-secondary py-1.5 px-3 text-xs cursor-pointer">
                Descartar
              </button>
              <button type="button" onClick={onKeepEditing} className="platform-btn-secondary py-1.5 px-3 text-xs cursor-pointer">
                Seguir editando
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-5 gap-1 px-3 pt-3">
          {STUDIO_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 rounded-lg py-2 text-[10px] font-semibold transition-colors cursor-pointer ${
                tab === item.id
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-alt)]'
              }`}
            >
              <i className={item.icon}></i>
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {tab === 'banner' && (
            <>
              <div className="space-y-2">
                <SectionLabel>Estilo animado</SectionLabel>
                <div className="grid grid-cols-3 gap-2">
                  {BANNER_STYLES.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => onChange({ bannerStyle: style.id })}
                      className={tileClass(draft.bannerStyle === style.id)}
                    >
                      <i className={`${style.icon} text-base`}></i>
                      {style.label}
                    </button>
                  ))}
                </div>
                {draft.bannerStyle === 'cover' && !hasCover && (
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Aún no subes un banner propio. Puedes hacerlo desde Editar datos y aquí se mostrará con movimiento.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <SectionLabel>Paleta</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {BANNER_PRESETS.map((preset) => {
                    const active = draft.bannerColorA === preset.a && draft.bannerColorB === preset.b
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        title={preset.label}
                        aria-label={`Paleta ${preset.label}`}
                        onClick={() => onChange({ bannerColorA: preset.a, bannerColorB: preset.b })}
                        className={`w-10 h-10 rounded-lg border-2 cursor-pointer transition-transform hover:scale-110 ${
                          active ? 'border-[var(--text)]' : 'border-transparent'
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${preset.a || DEFAULT_BANNER_A}, ${preset.b || DEFAULT_BANNER_B})`,
                        }}
                      />
                    )
                  })}
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <label className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                    <input
                      type="color"
                      value={colorInputValue(draft.bannerColorA)}
                      onChange={(e) => onChange({ bannerColorA: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border border-[var(--border)] bg-transparent"
                    />
                    Color principal
                  </label>
                  <label className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                    <input
                      type="color"
                      value={colorInputValue(draft.bannerColorB)}
                      onChange={(e) => onChange({ bannerColorB: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border border-[var(--border)] bg-transparent"
                    />
                    Color secundario
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <SectionLabel>Velocidad</SectionLabel>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">{draft.bannerSpeed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min={0.4}
                  max={2.5}
                  step={0.1}
                  value={draft.bannerSpeed}
                  onChange={(e) => onChange({ bannerSpeed: Number(e.target.value) })}
                  className="w-full cursor-pointer"
                  aria-label="Velocidad de la animación del banner"
                />
              </div>
            </>
          )}

          {tab === 'avatar' && (
            <>
              <div className="space-y-2">
                <SectionLabel>Forma</SectionLabel>
                <div className="grid grid-cols-3 gap-2">
                  {AVATAR_SHAPES.map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => onChange({ avatarShape: shape.id })}
                      className={tileClass(draft.avatarShape === shape.id)}
                    >
                      <span
                        className="block w-7 h-7 bg-current opacity-80"
                        style={getShapeStyle(shape.id)}
                      />
                      {shape.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <SectionLabel>Marco animado</SectionLabel>
                <div className="grid grid-cols-3 gap-2">
                  {FRAME_STYLES.map((frame) => (
                    <button
                      key={frame.id}
                      type="button"
                      onClick={() => onChange({ frameStyle: frame.id })}
                      className={tileClass(draft.frameStyle === frame.id)}
                    >
                      <i className={`${frame.icon} text-base`}></i>
                      {frame.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <SectionLabel>Color del marco y del anillo de nivel</SectionLabel>
                <div className="flex flex-wrap items-center gap-2">
                  {FRAME_COLORS.map((color) => (
                    <button
                      key={color || 'accent'}
                      type="button"
                      title={color ? color : 'Color de acento'}
                      aria-label={color ? `Color ${color}` : 'Color de acento'}
                      onClick={() => onChange({ frameColor: color })}
                      className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${
                        draft.frameColor === color ? 'border-[var(--text)]' : 'border-transparent'
                      }`}
                      style={{ background: color || 'var(--primary)' }}
                    />
                  ))}
                  <input
                    type="color"
                    value={colorInputValue(draft.frameColor)}
                    onChange={(e) => onChange({ frameColor: e.target.value })}
                    aria-label="Color personalizado del marco"
                    className="w-8 h-8 rounded cursor-pointer border border-[var(--border)] bg-transparent"
                  />
                </div>
              </div>

              <Link
                to="/personalizacion?seccion=avatar"
                className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] px-3 py-2.5 text-xs font-semibold text-[var(--text)] transition-colors hover:border-[var(--primary)]"
              >
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-user-astronaut text-[var(--primary)]"></i>
                  Elegir otro avatar o subir mi foto
                </span>
                <i className="fa-solid fa-arrow-right text-[10px] text-[var(--text-muted)]"></i>
              </Link>

              <Toggle
                checked={draft.showLevelRing}
                onChange={(value) => onChange({ showLevelRing: value })}
                label="Anillo de progreso de nivel"
                description="Muestra tu avance de XP alrededor del avatar."
              />
            </>
          )}

          {tab === 'status' && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <SectionLabel>Tu estado</SectionLabel>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    {draft.status.length}/{MAX_STATUS_LENGTH}
                  </span>
                </div>
                <input
                  type="text"
                  value={draft.status}
                  maxLength={MAX_STATUS_LENGTH}
                  onChange={(e) => onChange({ status: e.target.value })}
                  placeholder="Qué estás haciendo ahora"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {STATUS_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => onChange({ status: suggestion })}
                      className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <SectionLabel>Icono</SectionLabel>
                <div className="grid grid-cols-4 gap-2">
                  {STATUS_ICONS.map((item) => (
                    <button
                      key={item.icon}
                      type="button"
                      onClick={() => onChange({ statusIcon: item.icon })}
                      className={tileClass(draft.statusIcon === item.icon)}
                    >
                      <i className={`${item.icon} text-base`}></i>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === 'showcase' && (
            <>
              <div className="space-y-2">
                <SectionLabel>Estadísticas visibles</SectionLabel>
                <div className="grid grid-cols-2 gap-2">
                  {STAT_OPTIONS.map((stat) => {
                    const active = draft.visibleStats.includes(stat.id)
                    return (
                      <button
                        key={stat.id}
                        type="button"
                        onClick={() => toggleStat(stat.id)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                          active
                            ? 'border-[var(--primary)] bg-[var(--bg-alt)] text-[var(--primary)]'
                            : 'border-[var(--border)] text-[var(--text-muted)]'
                        }`}
                      >
                        <i className={stat.icon}></i>
                        {stat.label}
                        {active && <i className="fa-solid fa-check ml-auto text-[10px]"></i>}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <SectionLabel>Logros fijados</SectionLabel>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    {draft.pinnedAchievements.length}/{MAX_PINNED_ACHIEVEMENTS}
                  </span>
                </div>
                {unlockedAchievements.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)]">
                    Cuando desbloquees logros podrás fijar hasta {MAX_PINNED_ACHIEVEMENTS} en tu vitrina.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {unlockedAchievements.map((achievement) => {
                      const pinned = draft.pinnedAchievements.includes(achievement.id)
                      const blocked = !pinned && draft.pinnedAchievements.length >= MAX_PINNED_ACHIEVEMENTS
                      return (
                        <button
                          key={achievement.id}
                          type="button"
                          disabled={blocked}
                          onClick={() => togglePinned(achievement.id)}
                          className={`w-full flex items-center gap-2 rounded-lg border px-3 py-2 text-xs text-left transition-colors ${
                            pinned
                              ? 'border-[var(--primary)] bg-[var(--bg-alt)] text-[var(--text)]'
                              : 'border-[var(--border)] text-[var(--text-muted)]'
                          } ${blocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <i className="fa-solid fa-medal text-[var(--primary)]"></i>
                          <span className="flex-1">{achievement.name}</span>
                          <i className={`fa-solid fa-thumbtack text-[10px] ${pinned ? 'text-[var(--primary)]' : ''}`}></i>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="border-t border-[var(--border)] pt-2">
                <Toggle
                  checked={draft.showStreakCalendar}
                  onChange={(value) => onChange({ showStreakCalendar: value })}
                  label="Calendario de racha"
                  description="Las últimas cuatro semanas de actividad."
                />
                <Toggle
                  checked={draft.showLevelJourney}
                  onChange={(value) => onChange({ showLevelJourney: value })}
                  label="Ruta de niveles"
                  description="Tu camino hacia el siguiente nivel."
                />
              </div>
            </>
          )}

          {tab === 'effects' && (
            <>
              <div className="space-y-1">
                <Toggle
                  checked={draft.glow}
                  onChange={(value) => onChange({ glow: value })}
                  label="Resplandor de la tarjeta"
                  description="Un halo suave del color de tu banner."
                />
                <Toggle
                  checked={draft.tilt}
                  onChange={(value) => onChange({ tilt: value })}
                  label="Efecto 3D en tarjetas"
                  description="Las estadísticas se inclinan siguiendo el cursor."
                />
              </div>

              <div className="space-y-2">
                <SectionLabel>Densidad del diseño</SectionLabel>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onChange({ density: 'comfortable' })}
                    className={tileClass(draft.density === 'comfortable')}
                  >
                    <i className="fa-solid fa-expand text-base"></i>
                    Cómoda
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ density: 'compact' })}
                    className={tileClass(draft.density === 'compact')}
                  >
                    <i className="fa-solid fa-compress text-base"></i>
                    Compacta
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-[var(--border)] px-5 py-4 space-y-3">
          <p className="text-[11px] text-[var(--text-muted)]">
            Estos ajustes se guardan en este navegador y solo cambian cómo se ve tu perfil.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onReset}
              className="platform-btn-secondary py-2 px-3 text-xs font-semibold cursor-pointer"
            >
              <i className="fa-solid fa-rotate-left mr-1.5"></i>
              Restablecer
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={!isDirty}
              className="platform-btn-primary flex-1 py-2 text-xs font-semibold justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-floppy-disk mr-1.5"></i>
              Guardar cambios
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}