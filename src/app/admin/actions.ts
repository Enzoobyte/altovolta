'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { slugify } from '@/lib/utils'
import type { ProductVariant } from '@/lib/types'

type ActionResult = { error?: string; ok?: boolean }

// ---------------------------------------------------------------
// AUTH
// ---------------------------------------------------------------

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

// ---------------------------------------------------------------
// CATEGORÍAS
// ---------------------------------------------------------------

export async function createCategory(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return { error: 'El nombre es obligatorio' }

  const { error } = await supabase.from('categories').insert({
    name,
    slug: slugify(name),
    sort_order: Number(formData.get('sort_order')) || 0,
  })
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function updateCategory(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const id = String(formData.get('id'))
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return { error: 'El nombre es obligatorio' }

  const { error } = await supabase
    .from('categories')
    .update({
      name,
      slug: slugify(name),
      sort_order: Number(formData.get('sort_order')) || 0,
    })
    .eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function deleteCategory(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', String(formData.get('id')))
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

// ---------------------------------------------------------------
// PRODUCTOS
// ---------------------------------------------------------------

function parseVariants(raw: string | null): ProductVariant[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (v: ProductVariant) => v.color?.trim() && v.size?.trim()
    )
  } catch {
    return []
  }
}

async function uploadImages(
  productId: string,
  files: FormDataEntryValue[]
): Promise<{ urls: string[]; failed: number }> {
  const supabase = await createClient()
  const urls: string[] = []
  let failed = 0

  for (const file of files) {
    if (!(file instanceof File) || file.size === 0) continue
    if (file.size > 5 * 1024 * 1024) {
      failed += 1
      continue
    }
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${productId}/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage
      .from('productos')
      .upload(path, file, { upsert: false })
    if (error) {
      failed += 1
    } else {
      const { data } = supabase.storage.from('productos').getPublicUrl(path)
      urls.push(data.publicUrl)
    }
  }
  return { urls, failed }
}

export async function saveProduct(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin()

  const id = String(formData.get('id') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return { error: 'El nombre es obligatorio' }

  const base = {
    name,
    slug: String(formData.get('slug') ?? '').trim() || slugify(name),
    description: String(formData.get('description') ?? ''),
    price: Number(formData.get('price')) || 0,
    old_price: Number(formData.get('old_price')) || null,
    featured: formData.get('featured') === 'on',
    category_id: String(formData.get('category_id') ?? '') || null,
    active: formData.get('active') === 'on',
  }

  const variants = parseVariants(String(formData.get('variants') ?? ''))
  const files = formData.getAll('images')

  let productId = id
  let error: { message: string } | null = null

  if (productId) {
    const { error: e } = await supabase.from('products').update(base).eq('id', productId)
    error = e
  } else {
    const { data, error: e } = await supabase
      .from('products')
      .insert(base)
      .select('id')
      .single()
    productId = data?.id ?? ''
    error = e
  }
  if (error) return { error: error.message }
  if (!productId) return { error: 'No se pudo guardar el producto' }

  // Variantes: reemplazo completo (color × talle → stock)
  await supabase.from('product_variants').delete().eq('product_id', productId)
  if (variants.length > 0) {
    const { error: e } = await supabase.from('product_variants').insert(
      variants.map((v) => ({
        product_id: productId,
        color: v.color.trim(),
        color_hex: v.color_hex || '#000000',
        size: v.size.trim(),
        stock: Math.max(0, Math.floor(Number(v.stock) || 0)),
      }))
    )
    if (e) return { error: e.message }
  }

  // Imágenes nuevas (color opcional por foto, alineado por índice)
  if (files.length > 0) {
    let imageColors: (string | null)[] = []
    try {
      imageColors = JSON.parse(String(formData.get('image_colors') ?? '[]'))
    } catch {
      imageColors = []
    }
    const { urls, failed } = await uploadImages(productId, files)
    if (urls.length > 0) {
      const { error: e } = await supabase.from('product_images').insert(
        urls.map((url, i) => ({
          product_id: productId,
          url,
          color: imageColors[i]?.trim() || null,
          sort_order: i,
        }))
      )
      if (e) return { error: e.message }
    }
    if (failed > 0) {
      return {
        error:
          files.length - failed === 0
            ? `No se pudo subir ninguna foto (${failed} archivo(s) con error; máximo 5 MB por archivo).`
            : `Se subieron ${files.length - failed} de ${files.length} foto(s). ${failed} no entró(aron) (máximo 5 MB por archivo).`,
      }
    }
  }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function updateImageColor(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const id = String(formData.get('id'))
  const color = String(formData.get('color') ?? '').trim() || null

  const { error } = await supabase.from('product_images').update({ color }).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function moveImage(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const id = String(formData.get('id'))
  const direction = String(formData.get('direction')) as 'up' | 'down'

  const { data: img } = await supabase
    .from('product_images')
    .select('product_id, sort_order')
    .eq('id', id)
    .maybeSingle()
  if (!img) return { error: 'Imagen no encontrada' }

  const { data: all } = await supabase
    .from('product_images')
    .select('id, sort_order')
    .eq('product_id', img.product_id)
    .order('sort_order', { ascending: true })

  const others = (all ?? []).filter((i) => i.id !== id)
  const neighbor =
    direction === 'up'
      ? [...others].reverse().find((i) => i.sort_order < img.sort_order)
      : others.find((i) => i.sort_order > img.sort_order)
  if (!neighbor) return { ok: true }

  const { error } = await supabase
    .from('product_images')
    .update({ sort_order: neighbor.sort_order })
    .eq('id', id)
  if (error) return { error: error.message }

  const { error: e2 } = await supabase
    .from('product_images')
    .update({ sort_order: img.sort_order })
    .eq('id', neighbor.id)
  if (e2) return { error: e2.message }

  revalidatePath('/admin', 'layout')
  return { ok: true }
}

export async function toggleFeatured(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const id = String(formData.get('id'))

  const { data: product } = await supabase
    .from('products')
    .select('featured')
    .eq('id', id)
    .maybeSingle()
  if (!product) return { error: 'Producto no encontrado' }

  const { error } = await supabase
    .from('products')
    .update({ featured: !product.featured })
    .eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function duplicateProduct(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const id = String(formData.get('id'))

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (!product) return { error: 'Producto no encontrado' }

  const { data: variants } = await supabase
    .from('product_variants')
    .select('color, color_hex, size, stock')
    .eq('product_id', id)
  const { data: images } = await supabase
    .from('product_images')
    .select('url, color, sort_order')
    .eq('product_id', id)
    .order('sort_order', { ascending: true })

  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('slug', `${product.slug}-copia`)
    .maybeSingle()

  const { data: inserted, error } = await supabase
    .from('products')
    .insert({
      name: `${product.name} (copia)`,
      slug: existing ? `${product.slug}-copia-${Date.now().toString().slice(-4)}` : `${product.slug}-copia`,
      description: product.description,
      price: product.price,
      old_price: product.old_price,
      featured: false,
      category_id: product.category_id,
      active: false,
    })
    .select('id')
    .single()
  if (error) return { error: error.message }

  if (variants && variants.length > 0) {
    await supabase.from('product_variants').insert(
      variants.map((v) => ({ ...v, product_id: inserted.id }))
    )
  }
  if (images && images.length > 0) {
    await supabase.from('product_images').insert(
      images.map((i) => ({ ...i, product_id: inserted.id }))
    )
  }

  revalidatePath('/admin', 'layout')
  return { ok: true }
}

export async function deleteProductImage(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const id = String(formData.get('id'))
  const url = String(formData.get('url'))

  await supabase.from('product_images').delete().eq('id', id)

  // Borrar el archivo del storage si pertenece al bucket productos
  const match = url.match(/\/storage\/v1\/object\/public\/productos\/(.+)$/)
  if (match) {
    await supabase.storage.from('productos').remove([decodeURIComponent(match[1])])
  }

  revalidatePath('/admin', 'layout')
  return { ok: true }
}

export async function deleteProduct(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const id = String(formData.get('id'))

  const { data: images } = await supabase
    .from('product_images')
    .select('url')
    .eq('product_id', id)

  const paths = (images ?? [])
    .map((i) => i.url.match(/\/storage\/v1\/object\/public\/productos\/(.+)$/)?.[1])
    .filter(Boolean)
  if (paths.length > 0) {
    await supabase.storage.from('productos').remove(paths.map(decodeURIComponent))
  }

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

// ---------------------------------------------------------------
// CONFIGURACIÓN DEL SITIO
// ---------------------------------------------------------------

export async function saveSettings(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin()

  const fields: Record<string, string> = {
    site_name: String(formData.get('site_name') ?? ''),
    whatsapp_number: String(formData.get('whatsapp_number') ?? '').replace(/\D/g, ''),
    instagram_url: String(formData.get('instagram_url') ?? ''),
    facebook_url: String(formData.get('facebook_url') ?? ''),
    tiktok_url: String(formData.get('tiktok_url') ?? ''),
    email: String(formData.get('email') ?? ''),
    address: String(formData.get('address') ?? ''),
    about_text: String(formData.get('about_text') ?? ''),
    announcement_text: String(formData.get('announcement_text') ?? ''),
  }

  const logoFile = formData.get('logo')
  if (logoFile instanceof File && logoFile.size > 0) {
    const path = `logo-${crypto.randomUUID()}.${logoFile.name.split('.').pop()?.toLowerCase() ?? 'png'}`
    const { error } = await supabase.storage.from('sitio').upload(path, logoFile)
    if (!error) {
      fields.logo_url = supabase.storage.from('sitio').getPublicUrl(path).data.publicUrl
    }
  }

  const bannerFile = formData.get('banner')
  if (bannerFile instanceof File && bannerFile.size > 0) {
    const path = `banner-${crypto.randomUUID()}.${bannerFile.name.split('.').pop()?.toLowerCase() ?? 'png'}`
    const { error } = await supabase.storage.from('sitio').upload(path, bannerFile)
    if (!error) {
      fields.banner_url = supabase.storage.from('sitio').getPublicUrl(path).data.publicUrl
    }
  }

  const rows = Object.entries(fields)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => ({ key, value }))

  const { error } = await supabase.from('site_settings').upsert(rows)
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}
