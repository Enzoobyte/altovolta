import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Resumen | Altovolta Admin' }

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [{ count: products }, { count: categories }, { count: variants }, { data: lowStock }] =
    await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('categories').select('id', { count: 'exact', head: true }),
      supabase
        .from('product_variants')
        .select('id', { count: 'exact', head: true }),
      supabase
        .from('product_variants')
        .select('product_id, color, size, stock')
        .lt('stock', 6)
        .order('stock', { ascending: true })
        .limit(5),
    ])

  const cards = [
    { label: 'Productos', value: products ?? 0, href: '/admin/productos' },
    { label: 'Categorías', value: categories ?? 0, href: '/admin/categorias' },
    { label: 'Variantes (color × talle)', value: variants ?? 0, href: '/admin/productos' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Resumen</h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300"
          >
            <p className="text-3xl font-bold tracking-tight">{card.value}</p>
            <p className="mt-1 text-sm text-zinc-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-4 font-semibold">Stock bajo (&lt; 6 unidades)</h2>
        {lowStock && lowStock.length > 0 ? (
          <div className="space-y-2">
            {lowStock.map((v, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-2 text-sm"
              >
                <span>
                  {v.color} / {v.size}
                </span>
                <span className={v.stock === 0 ? 'font-semibold text-red-600' : 'text-amber-600'}>
                  {v.stock} u.
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Sin alertas de stock.</p>
        )}
      </section>
    </div>
  )
}
