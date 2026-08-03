'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { saveSettings } from '../actions'
import type { SiteSettings } from '@/lib/types'

const inputCls =
  'w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-600'

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  function run(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    startTransition(async () => {
      const result = await saveSettings(new FormData(e.currentTarget))
      if (result.error) setError(result.error)
      else router.refresh()
    })
  }

  return (
    <form onSubmit={run} className="space-y-6">
      {error && (
        <p className="rounded-lg border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="font-semibold text-white">Información general</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="site_name" className="mb-1 block text-sm font-medium text-zinc-400">
              Nombre del local
            </label>
            <input id="site_name" name="site_name" defaultValue={settings.site_name} className={inputCls} />
          </div>
          <div>
            <label htmlFor="whatsapp_number" className="mb-1 block text-sm font-medium text-zinc-400">
              WhatsApp (número) *
            </label>
            <input
              id="whatsapp_number"
              name="whatsapp_number"
              defaultValue={settings.whatsapp_number}
              placeholder="5491123456789"
              className={inputCls}
            />
            <p className="mt-1 text-xs text-zinc-600">Formato internacional sin +: 549 + país + número.</p>
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-400">
              Email
            </label>
            <input id="email" name="email" type="email" defaultValue={settings.email} className={inputCls} />
          </div>
          <div>
            <label htmlFor="address" className="mb-1 block text-sm font-medium text-zinc-400">
              Dirección del local
            </label>
            <input id="address" name="address" defaultValue={settings.address} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="about_text" className="mb-1 block text-sm font-medium text-zinc-400">
              Texto de presentación (sobre el local)
            </label>
            <textarea id="about_text" name="about_text" rows={3} defaultValue={settings.about_text} className={inputCls} />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="font-semibold text-white">Redes sociales</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="instagram_url" className="mb-1 block text-sm font-medium text-zinc-400">
              Instagram
            </label>
            <input id="instagram_url" name="instagram_url" defaultValue={settings.instagram_url} placeholder="https://instagram.com/altovolta.ar" className={inputCls} />
          </div>
          <div>
            <label htmlFor="facebook_url" className="mb-1 block text-sm font-medium text-zinc-400">
              Facebook
            </label>
            <input id="facebook_url" name="facebook_url" defaultValue={settings.facebook_url} placeholder="https://facebook.com/altovolta" className={inputCls} />
          </div>
          <div>
            <label htmlFor="tiktok_url" className="mb-1 block text-sm font-medium text-zinc-400">
              TikTok
            </label>
            <input id="tiktok_url" name="tiktok_url" defaultValue={settings.tiktok_url} placeholder="https://tiktok.com/@altovolta" className={inputCls} />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="font-semibold text-white">Logo y banner</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-zinc-400">Logo</p>
            {settings.logo_url ? (
              <Image
                src={logoPreview ?? settings.logo_url}
                alt="Logo actual"
                width={160}
                height={160}
                className="mb-3 h-32 w-auto rounded-lg border border-zinc-800 object-contain"
              />
            ) : (
              logoPreview && (
                <img src={logoPreview} alt="" className="mb-3 h-32 w-auto rounded-lg border border-zinc-800 object-contain" />
              )
            )}
            <input
              type="file"
              name="logo"
              accept="image/png,image/webp,image/svg+xml"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setLogoPreview(URL.createObjectURL(file))
              }}
              className="block w-full text-sm text-zinc-500 file:mr-3 file:rounded-lg file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-zinc-400">Banner (home)</p>
            {settings.banner_url && (
              <Image
                src={bannerPreview ?? settings.banner_url}
                alt="Banner actual"
                width={320}
                height={160}
                className="mb-3 w-full rounded-lg border border-zinc-800 object-cover"
              />
            )}
            {bannerPreview && !settings.banner_url && (
              <img src={bannerPreview} alt="" className="mb-3 w-full rounded-lg border border-zinc-800 object-cover" />
            )}
            <input
              type="file"
              name="banner"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setBannerPreview(URL.createObjectURL(file))
              }}
              className="block w-full text-sm text-zinc-500 file:mr-3 file:rounded-lg file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
        >
          {isPending ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
