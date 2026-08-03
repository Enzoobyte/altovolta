export type Category = {
  id: string
  name: string
  slug: string
  sort_order: number
  created_at: string
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  category_id: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export type ProductVariant = {
  id: string
  product_id: string
  color: string
  color_hex: string
  size: string
  stock: number
}

export type ProductImage = {
  id: string
  product_id: string
  url: string
  sort_order: number
  created_at: string
}

export type ProductWithRelations = Product & {
  category: Category | null
  variants: ProductVariant[]
  images: ProductImage[]
}

export type SiteSettings = {
  site_name: string
  whatsapp_number: string
  instagram_url: string
  facebook_url: string
  tiktok_url: string
  email: string
  address: string
  about_text: string
  logo_url: string
  banner_url: string
}

export const SITE_SETTINGS_KEYS = [
  'site_name',
  'whatsapp_number',
  'instagram_url',
  'facebook_url',
  'tiktok_url',
  'email',
  'address',
  'about_text',
  'logo_url',
  'banner_url',
] as const
