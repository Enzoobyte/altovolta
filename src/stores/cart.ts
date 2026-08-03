import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type CartItem = {
  key: string
  productId: string
  slug: string
  name: string
  price: number
  image: string | null
  color: string
  size: string
  quantity: number
  maxStock: number
}

type CartState = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'key' | 'quantity'> & { quantity?: number }) => void
  setQuantity: (key: string, quantity: number) => void
  removeItem: (key: string) => void
  clear: () => void
  total: () => number
  count: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(item) {
        const key = `${item.productId}:${item.color}:${item.size}`
        set((state) => {
          const existing = state.items.find((i) => i.key === key)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.key === key
                  ? { ...i, quantity: Math.min(i.quantity + (item.quantity ?? 1), i.maxStock) }
                  : i
              ),
            }
          }
          return {
            items: [...state.items, { ...item, key, quantity: item.quantity ?? 1 }],
          }
        })
      },

      setQuantity(key, quantity) {
        set((state) => ({
          items: state.items.map((i) =>
            i.key === key
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock)) }
              : i
          ),
        }))
      },

      removeItem(key) {
        set((state) => ({ items: state.items.filter((i) => i.key !== key) }))
      },

      clear() {
        set({ items: [] })
      },

      total() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },

      count() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },
    }),
    {
      name: 'altovolta-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
