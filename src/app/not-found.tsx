import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">Error 404</p>
      <h1 className="mt-3 text-4xl font-extrabold uppercase tracking-tight text-white">
        Página no encontrada
      </h1>
      <p className="mt-3 max-w-md text-zinc-400">
        La prenda que buscás no existe o fue removida del catálogo.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-red-600 px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-red-500"
      >
        Volver al catálogo
      </Link>
    </main>
  )
}
