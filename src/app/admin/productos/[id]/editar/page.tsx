import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/product-form'

export const metadata: Metadata = { title: 'Editar producto | Altovolta Admin' }

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const supabase = await createClient()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, slug, description, price, old_price, featured, category_id, active, created_at, updated_at')
      .eq('id', id)
      .single(),
    supabase
      .from('categories')
      .select('id, name, slug, sort_order, created_at')
      .order('sort_order', { ascending: true }),
  ])

  if (!product) notFound()

  const [{ data: variants }, { data: images }] = await Promise.all([
    supabase
      .from('product_variants')
      .select('id, product_id, color, color_hex, size, stock')
      .eq('product_id', id)
      .order('color', { ascending: true }),
    supabase
      .from('product_images')
      .select('id, product_id, url, color, sort_order, created_at')
      .eq('product_id', id)
      .order('sort_order', { ascending: true }),
  ])

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Editar: {product.name}</h1>
      <ProductForm
        categories={categories ?? []}
        product={{ ...product, variants: variants ?? [], images: images ?? [] }}
      />
    </div>
  )
}
