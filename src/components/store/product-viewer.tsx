'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ProductBuyer } from './product-buyer'
import { formatPrice, cn } from '@/lib/utils'
import type { ProductVariant, ProductImage } from '@/lib/types'

export function ProductViewer({
  product,
  variants,
  images,
  oldPrice,
  children,
}: {
  product: { id: string; slug: string; name: string; price: number }
  variants: ProductVariant[]
  images: ProductImage[]
  oldPrice?: number | null
  children?: React.ReactNode
}) {
  const colors = useMemo(() => [...new Set(variants.map((v) => v.color))], [variants])
  const [selectedColor, setSelectedColor] = useState<string | null>(
    colors.length === 1 ? colors[0] : null
  )
  const [mainIndex, setMainIndex] = useState(0)

  // Si cambia el color, se vuelve a la primera foto (patrón "adjust state during render")
  const [prevColor, setPrevColor] = useState(selectedColor)
  if (prevColor !== selectedColor) {
    setPrevColor(selectedColor)
    setMainIndex(0)
  }

  // Fotos del color elegido; si no hay, fotos generales
  const visibleImages = useMemo(() => {
    const specific = selectedColor ? images.filter((i) => i.color === selectedColor) : []
    if (specific.length > 0) return specific
    return images.filter((i) => !i.color)
  }, [images, selectedColor])

  const current =
    visibleImages.length > 0
      ? visibleImages[Math.min(mainIndex, visibleImages.length - 1)]
      : null

  const imageForColor = useMemo(() => {
    const specific = selectedColor ? images.filter((i) => i.color === selectedColor) : []
    if (specific.length > 0) return specific[0].url
    return images.find((i) => !i.color)?.url ?? null
  }, [images, selectedColor])

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* GALERÍA */}
      <div className="space-y-4">
        {current ? (
          <Image
            key={current.url}
            src={current.url}
            alt={`${product.name} ${selectedColor ?? ''}`.trim()}
            width={800}
            height={1000}
            priority
            className="aspect-[4/5] w-full rounded-2xl border border-zinc-800 object-cover"
          />
        ) : (
          <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-4xl text-zinc-700">
            ◇
          </div>
        )}

        {visibleImages.length > 1 && (
          <div className="flex flex-wrap gap-3">
            {visibleImages.map((img, i) => (
              <button
                key={img.url}
                type="button"
                onClick={() => setMainIndex(i)}
                className={cn(
                  'overflow-hidden rounded-xl border-2 transition',
                  i === Math.min(mainIndex, visibleImages.length - 1)
                    ? 'border-red-600'
                    : 'border-zinc-800 opacity-60 hover:opacity-100'
                )}
              >
                <Image
                  src={img.url}
                  alt=""
                  width={96}
                  height={120}
                  className="h-24 w-20 object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {selectedColor && !images.some((i) => i.color === selectedColor) && (
          <p className="text-xs text-zinc-500">
            Sin fotos específicas para {selectedColor}: mostrando fotos generales.
          </p>
        )}
      </div>

      {/* INFO + COMPRA */}
      <div id="comprar" className="scroll-mt-24 pb-24 lg:pb-0">
        {children}

        <ProductBuyer
          product={product}
          variants={variants}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
          imageForColor={imageForColor}
        />
      </div>

      {/* STICKY MÓVIL: precio + comprar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-black/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-white">{formatPrice(product.price)}</p>
            {oldPrice && oldPrice > product.price && (
              <p className="text-xs text-zinc-500 line-through">{formatPrice(oldPrice)}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() =>
              document.getElementById('comprar')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-red-500"
          >
            Elegir color y talle
          </button>
        </div>
      </div>
    </div>
  )
}
