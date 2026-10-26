const FILES = import.meta.glob<string>('../../assets/conocenos/*/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
})

const find = (slug: string, base: string) => {
  const prefix = `/conocenos/${slug}/${base}.`
  const key = Object.keys(FILES).find((path) => path.includes(prefix))
  return key ? FILES[key] : undefined
}

export const photosFor = (slug: string) => ({
  photo: find(slug, 'tarjeta'),
  detailPhoto: find(slug, 'perfil'),
})
