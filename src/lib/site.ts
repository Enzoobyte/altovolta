import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { SITE_SETTINGS_KEYS, type Category, type SiteSettings } from '@/lib/types'

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('key, value')

  const settings = {} as SiteSettings
  for (const key of SITE_SETTINGS_KEYS) {
    settings[key] = data?.find((row) => row.key === key)?.value ?? ''
  }
  return settings
})

export const getCategories = cache(async (): Promise<Category[]> => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
  return data ?? []
})
