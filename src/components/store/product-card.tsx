import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

type CardProduct = {
  slug: string
  name: string
  price: number
  image: string | null
}

export function ProductCard({ product }: { product: CardProduct }) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group block overflow-hidden rounded-xl bg-white transition hover:shadow-lg"
    >
      <div className="aspect-[4/5] overflow-hidden bg-zinc-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={750}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl text-zinc-300">◇</div>
        )}
      </div>
      <div className="p-4">
        <p className="line-clamp-1 font-medium">{product.name}</p>
        <p className="mt-1 text-sm text-zinc-500">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}
