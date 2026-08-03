import { getSiteSettings } from '@/lib/site'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { WhatsAppIcon } from './icons'

export async function WhatsAppFloat() {
  const settings = await getSiteSettings()
  if (!settings.whatsapp_number) return null

  const href = buildWhatsAppUrl(
    settings.whatsapp_number,
    '¡Hola! 👋 Vengo de la web y quiero hacer una consulta.'
  )

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/50 transition hover:scale-110"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  )
}
