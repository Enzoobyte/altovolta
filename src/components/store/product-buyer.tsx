'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/stores/cart'
import { formatPrice, cn } from '@/lib/utils'
import type { ProductVariant } from '@/lib/types'

export function ProductBuyer({
  product,
  variants,
  images,
}: {
  product: { id: string; slug: string; name: string; price: number }
  variants: ProductVariant[]
  images: { url: string }[]
}) {
  const router = useRouter()
  const addItem = useCart((s) => s.addItem)
  const firstImage = images[0]?.url ?? null

  const colors = useMemo(() => {
    const seen = new Set<string>()
    return variants
      .filter((v) => {
        if (seen.has(v.color)) return false
        seen.add(v.color)
        return true
      })
      .map((v) => ({ color: v.color, hex: v.color_hex }))
  }, [variants])

  const [selectedColor, setSelectedColor] = useState<string | null>(
    colors.length === 1 ? colors[0].color : null
  )
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  // Talles disponibles SOLO para el color elegido
  const sizesForColor = useMemo(() => {
    if (!selectedColor) return []
    return variants
      .filter((v) => v.color === selectedColor)
      .sort((a, b) => {
        const getNum = (s: string) => parseInt(s, 10) || 999
        return getNum(a.size) - getNum(b.size)
      })
  }, [variants, selectedColor])

  const selectedVariant = useMemo(
    () => sizesForColor.find((v) => v.size === selectedSize) ?? null,
    [sizesForColor, selectedSize]
  )

  const maxStock = selectedVariant?.stock ?? 0

  function selectColor(color: string) {
    setSelectedColor(color)
    setSelectedSize(null)
    setQuantity(1)
    setAdded(false)
  }

  function selectSize(size: string) {
    setSelectedSize(size)
    setQuantity(1)
    setAdded(false)
  }

  function addToCart(andGo = false) {
    if (!selectedColor || !selectedVariant) return
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: firstImage,
      color: selectedColor,
      size: selectedVariant.size,
      quantity,
      maxStock: maxStock,
    })
    setAdded(true)
    if (andGo) router.push('/carrito')
  }

  return (
    <div className="mt-8 space-y-6">
      {/* COLOR */}
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-300">
          Color{selectedColor ? `: ${selectedColor}` : ' *'}
        </p>
        <div className="flex flex-wrap gap-2">
          {colors.map(({ color, hex }) => (
            <button
              key={color}
              type="button"
              onClick={() => selectColor(color)}
              className={cn(
                'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
                selectedColor === color
                  ? 'border-red-600 bg-red-600/10 text-white'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-red-600'
              )}
            >
              <span
                className="h-4 w-4 rounded-full border border-white/20"
                style={{ backgroundColor: hex }}
              />
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* TALLE — según el color elegido */}
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-300">
          Talle{selectedSize ? `: ${selectedSize}` : ' *'}
        </p>
        <div className="flex flex-wrap gap-2">
          {sizesForColor.map((v) => (
            <button
              key={v.id}
              type="button"
              disabled={v.stock === 0}
              onClick={() => selectSize(v.size)}
              className={cn(
                'min-w-12 rounded-lg border px-4 py-2 text-sm font-medium transition',
                v.stock === 0
                  ? 'cursor-not-allowed border-zinc-800 bg-zinc-950 text-zinc-600 line-through'
                  : selectedSize === v.size
                    ? 'border-red-600 bg-red-600 text-white'
                    : 'border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-red-600'
              )}
            >
              {v.size}
            </button>
          ))}
        </div>
        {selectedColor && sizesForColor.length === 0 && (
          <p className="mt-2 text-sm text-zinc-500">Este color no tiene talles cargados.</p>
        )}
      </div>

      {/* CANTIDAD */}
      {selectedVariant && maxStock > 0 && (
        <div className="flex items-center gap-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-300">Cantidad</p>
          <div className="flex items-center rounded-full border border-zinc-700 bg-zinc-900">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-4 py-2 text-lg font-medium text-zinc-200 hover:text-red-500"
            >
              −
            </button>
            <span className="w-8 text-center font-semibold text-white">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
              className="px-4 py-2 text-lg font-medium text-zinc-200 hover:text-red-500"
            >
              +
            </button>
          </div>
          <span className="text-sm text-zinc-400">{maxStock} disponibles</span>
        </div>
      )}

      {/* ACCIONES */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={!selectedColor || !selectedSize || maxStock === 0}
          onClick={() => addToCart(false)}
          className="flex-1 rounded-full bg-red-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
        </button>
        <button
          type="button"
          disabled={!selectedColor || !selectedSize || maxStock === 0}
          onClick={() => addToCart(true)}
          className="rounded-full border border-red-600 py-3.5 text-sm font-bold uppercase tracking-wide text-red-500 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Comprar ahora
        </button>
      </div>

      {selectedVariant && maxStock > 0 && (
        <p className="text-sm text-zinc-400">
          Subtotal:{' '}
          <span className="font-semibold text-red-500">{formatPrice(product.price * quantity)}</span>
        </p>
      )}
    </div>
  )
}
