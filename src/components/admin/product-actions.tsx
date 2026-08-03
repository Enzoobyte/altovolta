'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleFeatured, duplicateProduct } from '@/app/admin/actions'
import { cn } from '@/lib/utils'

export function ProductActions({
  productId,
  featured,
}: {
  productId: string
  featured: boolean
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function run(action: (fd: FormData) => Promise<{ error?: string; ok?: boolean }>) {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', productId)
      const result = await action(fd)
      if (result.ok) router.refresh()
    })
  }

  return (
    <div className="flex shrink-0 gap-2">
      <button
        type="button"
        title={featured ? 'Quitar destacado' : 'Destacar en la tienda'}
        disabled={isPending}
        onClick={() => run(toggleFeatured)}
        className={cn(
          'rounded-lg border px-3 py-1.5 text-sm transition disabled:opacity-50',
          featured
            ? 'border-amber-500 text-amber-400'
            : 'border-zinc-700 text-zinc-500 hover:border-amber-500 hover:text-amber-400'
        )}
      >
        ★
      </button>
      <button
        type="button"
        title="Duplicar producto"
        disabled={isPending}
        onClick={() => run(duplicateProduct)}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800 disabled:opacity-50"
      >
        ⧉
      </button>
    </div>
  )
}
