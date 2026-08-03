'use client'

import Link from 'next/link'
import { useCart } from '@/stores/cart'

export function CartLink() {
  const count = useCart((s) => s.count())

  return (
    <Link
      href="/carrito"
      className="relative flex h-10 items-center gap-2 rounded-full bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-700"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 6h15l-1.5 8.5a2 2 0 0 1-2 1.5H8.5A2 2 0 0 1 6.5 14L4 3H2" />
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="17" cy="20" r="1.5" />
      </svg>
      <span className="hidden sm:inline">Carrito</span>
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  )
}
