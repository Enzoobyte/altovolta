'use client'

const SIZES = [
  { talle: 'S', pecho: '50 cm', largo: '66 cm', manga: '20 cm' },
  { talle: 'M', pecho: '54 cm', largo: '70 cm', manga: '21 cm' },
  { talle: 'L', pecho: '58 cm', largo: '74 cm', manga: '22 cm' },
  { talle: 'XL', pecho: '62 cm', largo: '78 cm', manga: '23 cm' },
]

export function SizeGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Guía de talles</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full border border-zinc-700 px-2.5 py-1 text-sm text-zinc-300 transition hover:border-red-600 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-700 text-left text-zinc-400">
                <th className="py-2 pr-4 font-semibold">Talle</th>
                <th className="py-2 pr-4 font-semibold">Pecho</th>
                <th className="py-2 pr-4 font-semibold">Largo</th>
                <th className="py-2 font-semibold">Manga</th>
              </tr>
            </thead>
            <tbody>
              {SIZES.map((s) => (
                <tr key={s.talle} className="border-b border-zinc-800 text-zinc-200">
                  <td className="py-2 pr-4 font-semibold text-white">{s.talle}</td>
                  <td className="py-2 pr-4">{s.pecho}</td>
                  <td className="py-2 pr-4">{s.largo}</td>
                  <td className="py-2">{s.manga}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-zinc-400">
          Medidas aproximadas de la prenda estirada, en centímetros. Si dudás entre dos talles, te
          recomendamos elegir el más grande. ¿Necesitás medidas exactas? Consultanos por WhatsApp y
          te ayudamos.
        </p>
      </div>
    </div>
  )
}
