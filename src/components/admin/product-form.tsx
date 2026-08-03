'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { saveProduct, deleteProductImage, updateImageColor } from '@/app/admin/actions'
import type { Category, ProductVariant, ProductImage } from '@/lib/types'
import { slugify } from '@/lib/utils'

type StockMatrix = Record<string, Record<string, number>>

const inputCls =
  'w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-600'
const labelCls = 'mb-1 block text-sm font-medium text-zinc-400'

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[]
  product?: {
    id: string
    name: string
    slug: string
    description: string
    price: number
    category_id: string | null
    active: boolean
    variants: ProductVariant[]
    images: ProductImage[]
  }
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(product))

  const [colors, setColors] = useState<string[]>(() => [
    ...new Set((product?.variants ?? []).map((v) => v.color)),
  ])
  const [colorHex, setColorHex] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    for (const v of product?.variants ?? []) map[v.color] = v.color_hex
    return map
  })
  const [sizes, setSizes] = useState<string[]>(() => [
    ...new Set((product?.variants ?? []).map((v) => v.size)),
  ])
  const [stock, setStock] = useState<StockMatrix>(() => {
    const matrix: StockMatrix = {}
    for (const v of product?.variants ?? []) {
      if (!matrix[v.color]) matrix[v.color] = {}
      matrix[v.color][v.size] = v.stock
    }
    return matrix
  })

  const [newColor, setNewColor] = useState('')
  const [newSize, setNewSize] = useState('')
  const [uploadColor, setUploadColor] = useState('')
  const [previewFiles, setPreviewFiles] = useState<File[]>([])
  const [previewColors, setPreviewColors] = useState<(string | null)[]>([])

  const variantsJson = useMemo(() => {
    const list: { color: string; color_hex: string; size: string; stock: number }[] = []
    for (const color of colors) {
      for (const size of sizes) {
        list.push({
          color,
          color_hex: colorHex[color] || '#000000',
          size,
          stock: stock[color]?.[size] ?? 0,
        })
      }
    }
    return JSON.stringify(list)
  }, [colors, sizes, colorHex, stock])

  function addColor() {
    const c = newColor.trim()
    if (!c || colors.includes(c)) return
    setColors([...colors, c])
    setNewColor('')
  }

  function removeColor(color: string) {
    setColors(colors.filter((c) => c !== color))
    setStock((prev) => {
      const next = { ...prev }
      delete next[color]
      return next
    })
  }

  function addSize() {
    const s = newSize.trim()
    if (!s || sizes.includes(s)) return
    setSizes([...sizes, s])
    setNewSize('')
  }

  function removeSize(size: string) {
    setSizes(sizes.filter((s) => s !== size))
    setStock((prev) => {
      const next: StockMatrix = {}
      for (const [color, rows] of Object.entries(prev)) {
        const rest = { ...rows }
        delete rest[size]
        next[color] = rest
      }
      return next
    })
  }

  function setStockCell(color: string, size: string, value: number) {
    setStock((prev) => ({
      ...prev,
      [color]: { ...prev[color], [size]: value },
    }))
  }

  function run(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    fd.delete('images')
    for (const file of previewFiles) fd.append('images', file)
    startTransition(async () => {
      const result = await saveProduct(fd)
      if (result.error) {
        setError(result.error)
        setPreviewFiles([])
        setPreviewColors([])
      } else {
        router.push('/admin/productos')
        router.refresh()
      }
    })
  }

  async function removeImage(img: ProductImage) {
    const fd = new FormData()
    fd.set('id', img.id)
    fd.set('url', img.url)
    const result = await deleteProductImage(fd)
    if (result.error) setError(result.error)
    else router.refresh()
  }

  function changeImageColor(img: ProductImage, color: string) {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', img.id)
      fd.set('color', color)
      const result = await updateImageColor(fd)
      if (result.error) setError(result.error)
      else router.refresh()
    })
  }

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (picked.length === 0) return
    const existing = new Set(previewFiles.map((f) => `${f.name}-${f.size}`))
    const fresh = picked.filter((f) => !existing.has(`${f.name}-${f.size}`))
    setPreviewFiles((prev) => [...prev, ...fresh])
    setPreviewColors((prev) => [...prev, ...fresh.map(() => uploadColor || null)])
  }

  function removePreview(index: number) {
    setPreviewFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviewColors((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <form id="product-form" onSubmit={run} className="space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      {error && (
        <p className="rounded-lg border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Datos básicos */}
      <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="font-semibold text-white">Datos básicos</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelCls}>
              Nombre *
            </label>
            <input
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (!slugTouched) setSlug(slugify(e.target.value))
              }}
              className={inputCls}
              placeholder="Ej: Buzo Oversize Algodón"
            />
          </div>
          <div>
            <label htmlFor="slug" className={labelCls}>
              URL (slug)
            </label>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value))
                setSlugTouched(true)
              }}
              className={inputCls}
              placeholder="buzo-oversize-algodon"
            />
          </div>
          <div>
            <label htmlFor="price" className={labelCls}>
              Precio ($) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={product?.price ?? ''}
              className={inputCls}
              placeholder="45000"
            />
          </div>
          <div>
            <label htmlFor="category_id" className={labelCls}>
              Categoría
            </label>
            <select
              id="category_id"
              name="category_id"
              defaultValue={product?.category_id ?? ''}
              className={inputCls}
            >
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className={labelCls}>
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={product?.description ?? ''}
              className={inputCls}
              placeholder="Composición, tela, cuidado…"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
          <input
            type="checkbox"
            name="active"
            defaultChecked={product?.active ?? true}
            className="h-4 w-4 accent-red-600"
          />
          Visible en la tienda
        </label>
      </section>

      {/* Fotos */}
      <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="font-semibold text-white">Fotos</h2>

        {product && product.images.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {product.images.map((img) => (
              <div key={img.id} className="group relative rounded-lg border border-zinc-800">
                <Image
                  src={img.url}
                  alt=""
                  width={200}
                  height={200}
                  className="aspect-square w-full rounded-t-lg object-cover"
                />
                <select
                  value={img.color ?? ''}
                  disabled={isPending}
                  onChange={(e) => changeImageColor(img, e.target.value)}
                  className="w-full rounded-b-lg border-0 border-t border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-300 outline-none focus:bg-zinc-900"
                >
                  <option value="">Foto general</option>
                  {colors.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeImage(img)}
                  className="absolute right-1 top-1 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="upload_color" className="block text-sm font-medium text-zinc-400">
            Color de las fotos a subir
          </label>
          <select
            id="upload_color"
            value={uploadColor}
            onChange={(e) => {
              setUploadColor(e.target.value)
              setPreviewColors((prev) => prev.map(() => e.target.value || null))
            }}
            className={inputCls}
          >
            <option value="">Foto general</option>
            {colors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <input type="hidden" name="image_colors" value={JSON.stringify(previewColors)} />

        {previewFiles.length > 0 && (
          <div>
            <p className="mb-2 text-sm text-zinc-400">
              {previewFiles.length} {previewFiles.length === 1 ? 'foto seleccionada' : 'fotos seleccionadas'}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {previewFiles.map((file, i) => (
                <div key={`${file.name}-${file.size}`} className="group relative rounded-lg border border-zinc-800">
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="aspect-square w-full rounded-t-lg object-cover"
                  />
                  <p className="truncate rounded-b-lg border-t border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-400">
                    {previewColors[i] || 'Foto general'}
                  </p>
                  <button
                    type="button"
                    onClick={() => removePreview(i)}
                    className="absolute right-1 top-1 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 py-8 text-sm text-zinc-500 transition hover:border-red-600 hover:bg-zinc-950">
          <span className="text-2xl">＋</span>
          <span className="mt-1 font-medium">
            {previewFiles.length > 0 ? 'Subir más fotos' : 'Subir fotos desde este dispositivo'}
          </span>
          <span className="text-xs text-zinc-600">
            Podés elegir varias a la vez o una por una · JPG, PNG, WEBP · hasta 5 MB
          </span>
          <input
            type="file"
            name="images"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="hidden"
            onChange={onPickFiles}
          />
        </label>
      </section>

      {/* Variantes: color × talle → stock */}
      <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="font-semibold text-white">Stock por color y talle</h2>
        <input type="hidden" name="variants" value={variantsJson} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Colores</label>
            <div className="flex gap-2">
              <input
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                placeholder="Ej: Negro"
                className={inputCls}
              />
              <button
                type="button"
                onClick={addColor}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                +
              </button>
            </div>
            {colors.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {colors.map((color) => (
                  <span
                    key={color}
                    className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-950 py-1 pl-1 pr-2 text-sm text-zinc-300"
                  >
                    <input
                      type="color"
                      value={colorHex[color] || '#000000'}
                      onChange={(e) => setColorHex({ ...colorHex, [color]: e.target.value })}
                      className="h-6 w-6 cursor-pointer rounded-full border-0 bg-transparent p-0"
                      title={`Color de ${color}`}
                    />
                    {color}
                    <button type="button" onClick={() => removeColor(color)} className="text-zinc-500 hover:text-red-500">
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className={labelCls}>Talles</label>
            <div className="flex gap-2">
              <input
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                placeholder="Ej: M"
                className={inputCls}
              />
              <button
                type="button"
                onClick={addSize}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                +
              </button>
            </div>
            {sizes.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <span
                    key={size}
                    className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-sm text-zinc-300"
                  >
                    {size}
                    <button type="button" onClick={() => removeSize(size)} className="text-zinc-500 hover:text-red-500">
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {colors.length > 0 && sizes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-700 text-left text-zinc-500">
                  <th className="py-2 pr-4 font-medium">Color</th>
                  {sizes.map((size) => (
                    <th key={size} className="px-2 py-2 text-center font-medium">
                      {size}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {colors.map((color) => (
                  <tr key={color} className="border-b border-zinc-800">
                    <td className="flex items-center gap-2 py-2 pr-4 text-zinc-300">
                      <span
                        className="h-4 w-4 rounded-full border border-zinc-600"
                        style={{ backgroundColor: colorHex[color] || '#000000' }}
                      />
                      {color}
                    </td>
                    {sizes.map((size) => (
                      <td key={size} className="px-2 py-2 text-center">
                        <input
                          type="number"
                          min="0"
                          value={stock[color]?.[size] ?? 0}
                          onChange={(e) => setStockCell(color, size, Math.max(0, Number(e.target.value) || 0))}
                          className="w-20 rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-center text-white outline-none focus:border-red-600"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">
            Agregá al menos un color y un talle para cargar el stock.
          </p>
        )}
      </section>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
        >
          {isPending ? 'Guardando…' : product ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </form>
  )
}
