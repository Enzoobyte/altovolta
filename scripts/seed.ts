// Seed local: crea el usuario admin y datos de ejemplo.
// Uso:  SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed.ts
import { createClient } from '@supabase/supabase-js'
import { slugify } from '../src/lib/utils'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error(
    'Faltan NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el entorno.'
  )
  process.exit(1)
}

const supabase = createClient(url, serviceKey)

async function main() {
  // 1. Usuario admin (lo podés cambiar por el de Supabase Dashboard)
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@altovolta.com'
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'altovolta2026'

  const { data: existing } = await supabase.auth.admin.listUsers()
  const found = existing?.users.find((u) => u.email === adminEmail)
  if (!found) {
    const { error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    })
    if (error) throw error
    console.log(`✓ Admin creado: ${adminEmail} / ${adminPassword}`)
  } else {
    console.log(`✓ Admin ya existía: ${adminEmail}`)
  }

  // 2. Categorías
  const categories = [
    { name: 'Remeras', sort_order: 1 },
    { name: 'Buzos', sort_order: 2 },
    { name: 'Pantalones', sort_order: 3 },
    { name: 'Accesorios', sort_order: 4 },
  ]

  const categoryRows = []
  for (const c of categories) {
    const { data, error } = await supabase
      .from('categories')
      .upsert({ name: c.name, slug: slugify(c.name), sort_order: c.sort_order })
      .select('id, slug')
      .single()
    if (error) throw error
    categoryRows.push(data)
  }
  const bySlug = Object.fromEntries(categoryRows.map((c) => [c.slug, c.id]))
  console.log('✓ Categorías creadas')

  // 3. Productos de ejemplo con variantes
  const products = [
    {
      name: 'Remera Básica Algodón',
      description: 'Algodón peinado 24/1, corte regular. Ideal para todos los días.',
      price: 24900,
      category: 'remeras',
      variants: [
        { color: 'Blanco', color_hex: '#f4f4f5', sizes: { S: 5, M: 8, L: 6, XL: 3 } },
        { color: 'Negro', color_hex: '#18181b', sizes: { S: 4, M: 7, L: 7, XL: 2 } },
      ],
    },
    {
      name: 'Buzo Oversize Cropped',
      description: 'Fleece 420gsm, tiro de hombros caído. Fit oversize.',
      price: 54900,
      category: 'buzos',
      variants: [
        { color: 'Gris', color_hex: '#a1a1aa', sizes: { S: 3, M: 5, L: 4 } },
        { color: 'Verde Militar', color_hex: '#4d5d3a', sizes: { S: 2, M: 4, L: 3 } },
      ],
    },
    {
      name: 'Jogger Cargo',
      description: 'Gabardina stretch con bolsillos cargo y cintura elástica.',
      price: 42900,
      category: 'pantalones',
      variants: [
        { color: 'Negro', color_hex: '#18181b', sizes: { S: 4, M: 6, L: 5, XL: 2 } },
        { color: 'Beige', color_hex: '#d6c7a1', sizes: { S: 3, M: 5, L: 4, XL: 1 } },
      ],
    },
    {
      name: 'Gorra Trucker',
      description: 'Panelada con ajuste clip. Unisex.',
      price: 15900,
      category: 'accesorios',
      variants: [
        { color: 'Negro', color_hex: '#18181b', sizes: { 'Único': 12 } },
        { color: 'Blanco', color_hex: '#f4f4f5', sizes: { 'Único': 8 } },
      ],
    },
  ]

  for (const p of products) {
    const { data: product, error } = await supabase
      .from('products')
      .upsert(
        {
          name: p.name,
          slug: slugify(p.name),
          description: p.description,
          price: p.price,
          category_id: bySlug[p.category],
          active: true,
        },
        { onConflict: 'slug' }
      )
      .select('id, slug')
      .single()
    if (error) throw error

    const rows = p.variants.flatMap((v) =>
      Object.entries(v.sizes).map(([size, stock]) => ({
        product_id: product.id,
        color: v.color,
        color_hex: v.color_hex,
        size,
        stock,
      }))
    )
    await supabase.from('product_variants').delete().eq('product_id', product.id)
    const { error: ve } = await supabase.from('product_variants').insert(rows)
    if (ve) throw ve

    console.log(`✓ Producto: ${p.name}`)
  }

  console.log('\nSeed completo. Entrá a /admin con las credenciales del admin.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
