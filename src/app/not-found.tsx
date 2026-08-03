import Link from 'next/link'
import { getSiteSettings } from '@/lib/site'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { WhatsAppIcon } from '@/components/store/icons'

export default async function NotFound() {
  const settings = await getSiteSettings()
  const whatsappUrl =
    settings.whatsapp_number &&
    buildWhatsAppUrl(
      settings.whatsapp_number,
      '¡Hola! 👋 Me aparece un error 404 en la web, quería avisarles.'
    )

  return (
    <main className="relative flex min-h-[72vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      <div
        aria-hidden
        className="animate-pulse-glow pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/15 blur-[130px]"
      />
      <div
        aria-hidden
        className="animate-float-blob pointer-events-none absolute left-[12%] top-16 h-52 w-52 rounded-full bg-red-600/10 blur-[90px]"
      />
      <div
        aria-hidden
        className="animate-float-blob pointer-events-none absolute bottom-10 right-[10%] h-64 w-64 rounded-full bg-zinc-500/10 blur-[100px]"
        style={{ animationDelay: '-6s' }}
      />

      <p className="text-8xl font-black leading-none tracking-tight text-white sm:text-[10rem]">
        4<span className="text-red-600 drop-shadow-[0_0_28px_rgba(220,38,38,0.5)]">0</span>4
      </p>
      <p className="mt-4 text-lg font-semibold text-white">Ups… esta página no existe</p>
      <p className="mt-2 max-w-md text-sm text-zinc-400">
        El enlace puede estar desactualizado o el producto ya no está disponible. Mirá el catálogo o
        escribinos por WhatsApp y te ayudamos.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-red-600 px-8 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-red-950/50 transition hover:scale-[1.03] hover:bg-red-500 active:scale-95"
        >
          Volver al catálogo
        </Link>
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-[#25D366]/50 px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#25D366] transition hover:scale-[1.03] hover:bg-[#25D366] hover:text-black active:scale-95"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Hablar con Altovolta
          </a>
        )}
      </div>
    </main>
  )
}
