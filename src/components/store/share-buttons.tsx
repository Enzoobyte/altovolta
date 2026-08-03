'use client'

import { useState } from 'react'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { WhatsAppIcon } from './icons'

export function ShareButtons({
  name,
  image,
  whatsappNumber,
}: {
  name: string
  image: string | null
  whatsappNumber: string
}) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard no disponible
    }
  }

  const waUrl = buildWhatsAppUrl(
    whatsappNumber,
    `Mirá esta prenda: ${name} — ${typeof window !== 'undefined' ? window.location.href : ''}`
  )

  return (
    <div className="flex items-center gap-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Compartir:</p>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartir por WhatsApp"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 transition hover:border-[#25D366] hover:text-[#25D366]"
      >
        <WhatsAppIcon className="h-4 w-4" />
      </a>
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copiar enlace"
        className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-300 transition hover:border-red-600 hover:text-red-500"
      >
        {copied ? '✓ Copiado' : 'Copiar link'}
      </button>
      {image && (
        <button
          type="button"
          onClick={async () => {
            try {
              const res = await fetch(image)
              const blob = await res.blob()
              const file = new File([blob], 'altovolta.jpg', { type: blob.type })
              await navigator.share({ files: [file], title: name })
            } catch {
              // no compartido
            }
          }}
          className="hidden rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-300 transition hover:border-red-600 hover:text-red-500"
        >
          Compartir foto
        </button>
      )}
    </div>
  )
}
