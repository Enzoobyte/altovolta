import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, firstOrNull } from '@/lib/utils'
import { deleteProduct } from '../actions'

export const metadata: Metadata = { title: 'Productos | Altovolta Admin' }

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select(
      'id, name, slug, price, active, category:categories(name), images:product_images(url)'
    )
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          + Nuevo producto
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900 p-12 text-center">
          <p className="text-zinc-400">Todavía no hay productos.</p>
          <Link
            href="/admin/productos/nuevo"
            className="mt-3 inline-block text-sm font-semibold text-red-500 underline"
          >
            Cargar el primero
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <ul className="divide-y divide-zinc-800">
            {products.map((p) => (
              <li key={p.id} className="flex items-center gap-4 p-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-950">
                  {p.images?.[0] ? (
                    <Image
                      src={p.images[0].url}
                      alt=""
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-lg text-zinc-700">
                      ◇
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">
                    {p.name}
                    {!p.active && (
                      <span className="ml-2 rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400">
                        oculto
                      </span>
                    )}
                  </p>
                  <p className="truncate text-sm text-zinc-400">
                    {firstOrNull(p.category)?.name ?? 'Sin categoría'} ·{' '}
                    <span className="text-red-500">{formatPrice(Number(p.price))}</span>
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/admin/productos/${p.id}/editar`}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800"
                  >
                    Editar
                  </Link>
                  <form
                    action={async (fd) => {
                      await deleteProduct(fd)
                    }}
                    onSubmit={(e) => {
                      if (!confirm('¿Eliminar este producto y sus fotos?')) e.preventDefault()
                    }}
                  >
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-red-900 px-3 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-950"
                    >
                      Eliminar
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
