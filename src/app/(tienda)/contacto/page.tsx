import type { Metadata } from 'next'
import Image from 'next/image'
import { getSiteSettings } from '@/lib/site'
import {
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
} from '@/components/store/icons'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

export const metadata: Metadata = { title: 'Contacto' }

export default async function ContactPage() {
  const settings = await getSiteSettings()

  const socials = [
    {
      label: 'Instagram',
      url: settings.instagram_url,
      Icon: InstagramIcon,
      color: '#E4405F',
    },
    {
      label: 'Facebook',
      url: settings.facebook_url,
      Icon: FacebookIcon,
      color: '#1877F2',
    },
    {
      label: 'TikTok',
      url: settings.tiktok_url,
      Icon: TikTokIcon,
      color: '#ffffff',
    },
  ].filter((s) => s.url)

  const whatsappUrl =
    settings.whatsapp_number &&
    buildWhatsAppUrl(settings.whatsapp_number, '¡Hola Altovolta! 👋')

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Contacto</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Hablá con <span className="text-red-600">altovolta</span>
      </h1>
      <p className="mt-3 max-w-lg text-zinc-400">
        Consultas, talles, stock y pedidos personalizados. Respondemos por los canales de abajo.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-[#25D366] hover:shadow-lg hover:shadow-green-950/40"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366]/10">
              <WhatsAppIcon className="h-6 w-6 text-[#25D366]" />
            </span>
            <p className="mt-3 font-bold text-white">WhatsApp</p>
            <p className="mt-1 text-sm text-zinc-400">
              {settings.whatsapp_number
                ? `+${settings.whatsapp_number.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4')}`
                : 'Chateá con el local'}
            </p>
            <p className="mt-2 text-sm font-medium text-[#25D366] group-hover:underline">
              Escribinos →
            </p>
          </a>
        )}

        {settings.email && (
          <a
            href={`mailto:${settings.email}`}
            className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-red-600 hover:shadow-lg hover:shadow-red-950/40"
          >
            <span className="text-2xl">📧</span>
            <p className="mt-3 font-bold text-white">Email</p>
            <p className="mt-1 text-sm text-zinc-400">{settings.email}</p>
            <p className="mt-2 text-sm font-medium text-red-500 group-hover:underline">
              Enviar mail →
            </p>
          </a>
        )}

        {settings.address && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <span className="text-2xl">📍</span>
            <p className="mt-3 font-bold text-white">El local</p>
            <p className="mt-1 text-sm text-zinc-400">{settings.address}</p>
          </div>
        )}

        {socials.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-red-600 hover:shadow-lg hover:shadow-red-950/40"
          >
            <span
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${s.color}1a` }}
            >
              <s.Icon className="h-6 w-6" style={{ color: s.color }} />
            </span>
            <p className="mt-3 font-bold text-white">{s.label}</p>
            <p className="mt-1 break-all text-sm text-zinc-400">
              {s.url.replace(/^https?:\/\//, '')}
            </p>
            <p className="mt-2 text-sm font-medium text-red-500 group-hover:underline">
              Seguir →
            </p>
          </a>
        ))}
      </div>

      {settings.banner_url && (
        <div className="mt-12 overflow-hidden rounded-2xl">
          <Image
            src={settings.banner_url}
            alt=""
            width={896}
            height={300}
            className="h-40 w-full object-cover"
          />
        </div>
      )}
    </main>
  )
}
