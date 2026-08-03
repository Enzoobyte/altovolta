import type { CartItem } from '@/stores/cart'

export function buildWhatsAppMessage(items: CartItem[], siteName: string): string {
  const money = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })

  const lines = items
    .map(
      (item, i) =>
        `${i + 1}. ${item.name}\n` +
        `   Talle: ${item.size} · Color: ${item.color}\n` +
        `   Cantidad: ${item.quantity} · Subtotal: ${money.format(item.price * item.quantity)}`
    )
    .join('\n\n')

  const total = money.format(items.reduce((sum, i) => sum + i.price * i.quantity, 0))

  return [
    `🛒 ¡Hola ${siteName}! Quiero hacer este pedido:`,
    '',
    lines,
    '',
    '━━━━━━━━━━━━━━━━━',
    `TOTAL: ${total}`,
    '',
    '¡Gracias! 🙌',
  ].join('\n')
}

export function buildWhatsAppUrl(number: string, message: string): string {
  // No usar wa.me: su redirect re-codifica el texto y convierte emojis en � (bug conocido en desktop/web).
  return `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`
}
