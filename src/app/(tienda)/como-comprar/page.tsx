import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/site'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { WhatsAppIcon } from '@/components/store/icons'

export const metadata: Metadata = {
  title: 'Cómo comprar',
  description:
    'Pasos para comprar en Altovolta: elegí tus prendas, enviá el pedido por WhatsApp y coordiná el envío o retiro.',
}

const steps = [
  {
    n: 1,
    title: 'Elegí tus prendas',
    text: 'Recorré el catálogo y elegí color, talle y cantidad de cada prenda. Agregá todo al carrito.',
  },
  {
    n: 2,
    title: 'Enviá el pedido por WhatsApp',
    text: 'Cuando termines, tocá "Enviar pedido". Se abre un WhatsApp con el detalle de tu carrito. Apretá enviar y listo.',
  },
  {
    n: 3,
    title: 'Confirmación y pago',
    text: 'Te respondemos con la confirmación de stock y las formas de pago disponibles: transferencia, efectivo y más.',
  },
  {
    n: 4,
    title: 'Recibí tu pedido',
    text: 'Coordinamos el envío a tu domicilio o el retiro por el local. Envíos a todo el país por correo.',
  },
]

const tips = [
  'Pedidos siempre coordinados por WhatsApp: respondemos en horario comercial.',
  'Las fotos del catálogo pueden variar levemente según el lote. Te avisamos cualquier diferencia.',
  'Cambios: dentro de los 15 días con la etiqueta puesta y en perfecto estado.',
  'Stock limitado: si una talle o color se agota, lo vemos al confirmar tu pedido.',
]

export default async function ComoComprarPage() {
  const settings = await getSiteSettings()
  const whatsappUrl =
    settings.whatsapp_number &&
    buildWhatsAppUrl(settings.whatsapp_number, '¡Hola! 👋 Quiero hacer un pedido.')

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-red-500">Guía de compra</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Cómo comprar
      </h1>
      <p className="mt-3 text-zinc-400">
        Comprar en Altovolta es muy fácil: todo se coordina por WhatsApp, sin registrarte ni pagar
        online.
      </p>

      <ol className="mt-10 space-y-6">
        {steps.map((s) => (
          <li key={s.n} className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 font-bold text-white">
              {s.n}
            </span>
            <div>
              <h2 className="font-semibold text-white">{s.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/#tienda"
          className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-red-500"
        >
          Ver catálogo
        </Link>
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-[#25D366]/50 px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#25D366] transition hover:bg-[#25D366] hover:text-black"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Consultar por WhatsApp
          </a>
        )}
      </div>

      <div className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="font-semibold text-white">Cosas a tener en cuenta</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-400">
          {tips.map((t) => (
            <li key={t} className="flex gap-2">
              <span className="text-red-500">•</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
