'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/stores/cart'
import { formatPrice } from '@/lib/utils'
import { buildWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp'

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
        <p className="text-2xl font-bold tracking-tight">Tu carrito está vacío</p>
        <p className="mt-2 text-zinc-500">Sumá alguna prenda del catálogo y volvé.</p>
        <Link
          href="/#tienda"
          className="mt-6 inline-block rounded-full bg-zinc-950 px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-zinc-700"
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
        <h1 className="text-2xl font-bold tracking-tight">Tu carrito</h1>
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
              className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4"
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
                <div className="flex h-28 w-24 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-2xl text-zinc-300">
                  ◇
                </div>
              )}

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/producto/${item.slug}`} className="font-semibold hover:underline">
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-zinc-500">
                      Talle <span className="font-medium text-zinc-700">{item.size}</span> · Color{' '}
                      <span className="font-medium text-zinc-700">{item.color}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="text-zinc-400 transition hover:text-red-500"
                    aria-label="Quitar del carrito"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-zinc-300">
                    <button
                      onClick={() => setQuantity(item.key, item.quantity - 1)}
                      className="px-3 py-1 text-lg hover:text-zinc-500"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.key, item.quantity + 1)}
                      className="px-3 py-1 text-lg hover:text-zinc-500"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* RESUMEN + WHATSAPP */}
        <aside className="h-fit space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="font-bold">Resumen</h2>
          <div className="flex justify-between text-sm text-zinc-600">
            <span>Productos ({items.length})</span>
            <span>{formatPrice(total())}</span>
          </div>
          <div className="flex justify-between border-t border-zinc-100 pt-3 text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(total())}</span>
          </div>

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-emerald-500 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-emerald-600"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.83 14.16c-.24.68-1.42 1.3-1.98 1.38-.51.07-1.15.1-1.85-.11-.43-.13-.98-.32-1.69-.63-2.99-1.3-4.94-4.32-5.09-4.52-.15-.2-1.22-1.62-1.22-3.09 0-1.47.77-2.19 1.05-2.49.27-.3.6-.37.8-.37.2 0 .4 0 .57.01.19.01.43-.07.68.52.25.6.86 2.11.94 2.26.08.15.13.33.03.53-.1.2-.15.32-.3.5-.15.17-.32.39-.45.52-.15.15-.31.31-.13.61.18.3.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.46 1.52.3.15.48.13.66-.08.17-.2.76-.88.96-1.19.2-.3.4-.25.68-.15.27.1 1.75.83 2.05.98.3.15.5.22.58.35.07.13.07.74-.17 1.42z" />
              </svg>
              Enviar pedido por WhatsApp
            </a>
          ) : (
            <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              El local todavía no configuró su número de WhatsApp.
            </p>
          )}

          <p className="text-xs leading-relaxed text-zinc-400">
            Se abre WhatsApp con tu pedido detallado (prenda, talle, color, cantidad y total). Al
            confirmar, coordinamos el pago y el envío.
          </p>
        </aside>
      </div>
    </div>
  )
}
