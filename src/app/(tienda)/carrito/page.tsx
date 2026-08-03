import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/site'
import { CartClient } from '@/components/store/cart-client'

export const metadata: Metadata = { title: 'Carrito' }

export default async function CartPage() {
  const settings = await getSiteSettings()

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <CartClient whatsappNumber={settings.whatsapp_number} siteName={settings.site_name} />
    </main>
  )
}
