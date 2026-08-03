'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory, deleteCategory, updateCategory } from '../actions'
import type { Category } from '@/lib/types'

const inputCls =
  'w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-600'

export default function CategoriesManager({
  categories,
}: {
  categories: Category[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  function run(action: (formData: FormData) => Promise<{ error?: string }>) {
    return (formData: FormData) => {
      startTransition(async () => {
        const result = await action(formData)
        if (result.error) {
          setError(result.error)
        } else {
          setError(null)
          setEditingId(null)
          router.refresh()
        }
      })
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-white">Categorías</h1>

      <form
        action={run(createCategory)}
        className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-5 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-zinc-400">
            Nueva categoría
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="Ej: Remeras"
            className={inputCls}
          />
        </div>
        <div className="w-full sm:w-32">
          <label htmlFor="sort_order" className="mb-1 block text-sm font-medium text-zinc-400">
            Orden
          </label>
          <input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={0}
            className={inputCls}
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
        >
          Crear
        </button>
      </form>

      {error && (
        <p className="rounded-lg border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
        {categories.length === 0 ? (
          <p className="p-5 text-sm text-zinc-500">Todavía no hay categorías.</p>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {categories.map((category) =>
              editingId === category.id ? (
                <li key={category.id} className="p-4">
                  <form
                    action={run(updateCategory)}
                    className="flex flex-col gap-3 sm:flex-row sm:items-end"
                  >
                    <input type="hidden" name="id" value={category.id} />
                    <div className="flex-1">
                      <label className="mb-1 block text-sm font-medium text-zinc-400">Nombre</label>
                      <input
                        name="name"
                        required
                        defaultValue={category.name}
                        className={inputCls}
                      />
                    </div>
                    <div className="w-full sm:w-32">
                      <label className="mb-1 block text-sm font-medium text-zinc-400">Orden</label>
                      <input
                        name="sort_order"
                        type="number"
                        defaultValue={category.sort_order}
                        className={inputCls}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </li>
              ) : (
                <li key={category.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-white">{category.name}</p>
                    <p className="text-xs text-zinc-500">
                      /{category.slug} · orden {category.sort_order}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(category.id)}
                      className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800"
                    >
                      Editar
                    </button>
                    <form
                      action={run(deleteCategory)}
                      onSubmit={(e) => {
                        if (!confirm('¿Eliminar esta categoría? Los productos quedan sin categoría.')) {
                          e.preventDefault()
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={category.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-900 px-3 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-950"
                      >
                        Eliminar
                      </button>
                    </form>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
