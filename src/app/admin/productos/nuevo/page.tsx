import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/product-form'

export const metadata: Metadata = { title: 'Nuevo producto | Altovolta Admin' }

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, sort_order, created_at')
    .order('sort_order', { ascending: true })

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Nuevo producto</h1>
      <ProductForm categories={categories ?? []} />
    </div>
  )
}
