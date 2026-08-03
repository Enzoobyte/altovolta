'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/stores/cart'
import { formatPrice } from '@/lib/utils'
import { buildWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp'
import { WhatsAppIcon } from './icons'

export function CartClient({
  whatsappNumber,
  siteName,
}: {
  whatsappNumber: string
  siteName: string
}) {
  const { items, setQuantity, removeItem, clear, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-2xl font-bold tracking-tight text-white">Tu carrito está vacío</p>
        <p className="mt-2 text-zinc-400">Sumá alguna prenda del catálogo y volvé.</p>
        <Link
          href="/#tienda"
          className="mt-6 inline-block rounded-full bg-red-600 px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-red-500"
        >
          Ir al catálogo
        </Link>
      </div>
    )
  }

  const whatsappUrl = whatsappNumber
    ? buildWhatsAppUrl(whatsappNumber, buildWhatsAppMessage(items, siteName))
    : null

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white">Tu carrito</h1>
        <button
          onClick={clear}
          className="text-sm font-medium text-zinc-400 underline-offset-2 hover:text-red-500 hover:underline"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* ÍTEMS */}
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.key}
              className="flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={96}
                  height={120}
                  className="h-28 w-24 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-28 w-24 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-2xl text-zinc-700">
                  ◇
                </div>
              )}

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/producto/${item.slug}`}
                      className="font-semibold text-white hover:text-red-500"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-zinc-400">
                      Talle <span className="font-medium text-zinc-200">{item.size}</span> · Color{' '}
                      <span className="font-medium text-zinc-200">{item.color}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="text-zinc-500 transition hover:text-red-500"
                    aria-label="Quitar del carrito"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-zinc-700 bg-zinc-950">
                    <button
                      onClick={() => setQuantity(item.key, item.quantity - 1)}
                      className="px-3 py-1 text-lg text-zinc-200 hover:text-red-500"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(item.key, item.quantity + 1)}
                      className="px-3 py-1 text-lg text-zinc-200 hover:text-red-500"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-semibold text-red-500">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* RESUMEN + WHATSAPP */}
        <aside className="h-fit space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 lg:sticky lg:top-24">
          <h2 className="font-bold text-white">Resumen</h2>
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Productos ({items.length})</span>
            <span>{formatPrice(total())}</span>
          </div>
          <div className="flex justify-between border-t border-zinc-800 pt-3 text-lg font-bold">
            <span className="text-white">Total</span>
            <span className="text-red-500">{formatPrice(total())}</span>
          </div>

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-sm font-bold uppercase tracking-wide text-black transition hover:bg-[#1fb959]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Enviar pedido por WhatsApp
            </a>
          ) : (
            <p className="rounded-xl border border-amber-700 bg-amber-950 px-4 py-3 text-sm text-amber-400">
              El local todavía no configuró su número de WhatsApp.
            </p>
          )}

          <p className="text-xs leading-relaxed text-zinc-500">
            Se abre WhatsApp con tu pedido detallado (prenda, talle, color, cantidad y total). Al
            confirmar, coordinamos el pago y el envío.
          </p>
        </aside>
      </div>
    </div>
  )
}
