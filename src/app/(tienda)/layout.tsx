import { StoreHeader } from '@/components/store/header'
import { StoreFooter } from '@/components/store/footer'
import { WhatsAppFloat } from '@/components/store/whatsapp-float'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreHeader />
      <div className="flex-1">{children}</div>
      <StoreFooter />
      <WhatsAppFloat />
    </>
  )
}
