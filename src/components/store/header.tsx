import Link from 'next/link'
import Image from 'next/image'
import { getSiteSettings } from '@/lib/site'
import { CartLink } from './cart-link'

export async function StoreHeader() {
  const settings = await getSiteSettings()

  return (
    <div className="sticky top-0 z-30">
      {settings.announcement_text && (
        <div className="overflow-hidden bg-red-600 py-1.5">
          <span
            className="animate-marquee-ltr inline-block whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-white"
            style={{
              animationDuration: `${Math.max(10, Math.round(settings.announcement_text.length / 6))}s`,
            }}
          >
            {settings.announcement_text}
          </span>
        </div>
      )}
      <header className="border-b border-zinc-800 bg-black/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          {settings.logo_url ? (
            <Image
              src={settings.logo_url}
              alt={settings.site_name}
              width={32}
              height={32}
              className="h-8 w-auto"
            />
          ) : (
            <span className="text-xl font-extrabold uppercase tracking-tight text-white">
              alt0<span className="text-red-600">volta</span>
            </span>
          )}
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium uppercase tracking-wide">
          <Link href="/" className="hidden text-zinc-300 transition hover:text-red-500 sm:block">
            Inicio
          </Link>
          <Link href="/#tienda" className="text-zinc-300 transition hover:text-red-500">
            Tienda
          </Link>
          <Link href="/contacto" className="text-zinc-300 transition hover:text-red-500">
            Contacto
          </Link>
        </nav>

        <CartLink />
      </div>
      </header>
    </div>
  )
}
