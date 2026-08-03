import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import CategoriesManager from './categorias-manager'

export const metadata: Metadata = { title: 'Categorías | Altovolta Admin' }

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  return <CategoriesManager categories={data ?? []} />
}
