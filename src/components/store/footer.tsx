import Link from 'next/link'
import { getSiteSettings } from '@/lib/site'

export async function StoreFooter() {
  const settings = await getSiteSettings()
  const year = new Date().getFullYear()

  const socials = [
    { label: 'Instagram', url: settings.instagram_url },
    { label: 'Facebook', url: settings.facebook_url },
    { label: 'TikTok', url: settings.tiktok_url },
  ].filter((s) => s.url)

  const whatsappUrl =
    settings.whatsapp_number &&
    `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent('¡Hola Altovolta! 👋')}`

  return (
    <footer className="border-t border-zinc-800 bg-black text-zinc-400">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="text-lg font-extrabold uppercase tracking-tight text-white">
            alt0<span className="text-red-600">volta</span>
          </p>
          {settings.about_text && (
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">{settings.about_text}</p>
          )}
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-600">
            Navegación
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="transition hover:text-red-500">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/#tienda" className="transition hover:text-red-500">
                Tienda
              </Link>
            </li>
            <li>
              <Link href="/carrito" className="transition hover:text-red-500">
                Carrito
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="transition hover:text-red-500">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-600">
            Seguinos
          </p>
          <ul className="space-y-2 text-sm">
            {whatsappUrl && (
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-red-500"
                >
                  WhatsApp
                </a>
              </li>
            )}
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-red-500"
                >
                  {s.label}
                </a>
              </li>
            ))}
            {socials.length === 0 && !whatsappUrl && (
              <li className="text-zinc-600">Próximamente en redes</li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-600">
        © {year} {settings.site_name} · Pedidos por WhatsApp
      </div>
    </footer>
  )
}
