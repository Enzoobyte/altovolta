'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProduct } from '@/app/admin/actions'

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleDelete() {
    if (!confirm('¿Eliminar este producto y sus fotos?')) return
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', productId)
      const result = await deleteProduct(fd)
      if (result.error) setError(result.error)
      else router.refresh()
    })
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-lg border border-red-900 px-3 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-950 disabled:opacity-50"
      >
        {isPending ? 'Eliminando…' : 'Eliminar'}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </span>
  )
}
