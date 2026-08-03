import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import SettingsForm from './settings-form'
import { SITE_SETTINGS_KEYS, type SiteSettings } from '@/lib/types'

export const metadata: Metadata = { title: 'Configuración | Altovolta Admin' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('key, value')

  const settings = {} as SiteSettings
  for (const key of SITE_SETTINGS_KEYS) {
    settings[key] = data?.find((row) => row.key === key)?.value ?? ''
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Configuración del sitio</h1>
      <SettingsForm settings={settings} />
    </div>
  )
}
