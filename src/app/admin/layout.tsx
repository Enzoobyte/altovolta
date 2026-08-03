import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { logout } from './actions'

const nav = [
  { href: '/admin', label: 'Resumen' },
  { href: '/admin/productos', label: 'Productos' },
  { href: '/admin/categorias', label: 'Categorías' },
  { href: '/admin/configuracion', label: 'Configuración' },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await requireAdmin()

  return (
    <div className="min-h-screen bg-zinc-100">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-zinc-200 bg-white lg:flex">
        <Link
          href="/admin"
          className="border-b border-zinc-200 px-6 py-5 text-lg font-bold tracking-tight"
        >
          Altovolta<span className="text-zinc-400">/admin</span>
        </Link>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-zinc-200 p-4">
          <p className="truncate text-xs text-zinc-500">{user.email}</p>
          <form action={logout}>
            <button className="mt-2 text-sm font-medium text-red-600 hover:text-red-700">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 lg:px-8">
          <nav className="flex gap-4 overflow-x-auto text-sm lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap font-medium text-zinc-600 hover:text-zinc-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Ver tienda ↗
            </Link>
            <form action={logout} className="lg:hidden">
              <button className="text-sm font-medium text-red-600">Salir</button>
            </form>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
