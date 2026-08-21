# Altovolta — Guía de uso

Guía completa para **clientes** (cómo comprar en la tienda) y para el **admin**
(cómo cargar y administrar el catálogo desde el panel).

---

## Parte 1 · Tienda (para clientes)

La tienda no tiene carrito de pago online: el pedido se arma y se envía por
**WhatsApp** al número del local. No hace falta registrarse.

### 1. Navegar el catálogo

- La **página principal** muestra el catálogo completo (hero + grilla de prendas).
- Podés **filtrar por categoría** con los botones redondos arriba de la grilla
  (`Todos`, o el nombre de cada categoría).
- Cada tarjeta de producto muestra: foto, nombre, precio, badge de **OFERTA**
  (cuando hay precio tachado), ★ si es **destacado** y "Nuevo" si se cargó hace
  menos de 14 días.
- Los talles sin stock aparecen tachados en la ficha del producto.

### 2. Elegir un producto

Al entrar a la ficha de un producto:

1. **Color** — tocá el color que querés. La foto puede cambiar si el admin
   asignó fotos por color.
2. **Talle** — solo se muestran los talles con stock **para el color elegido**.
   Hay una "Guía de talles" disponible si el admin la activó.
3. **Cantidad** — se limita al stock disponible.
4. Tocá **"Agregar al carrito"** o **"Comprar ahora"** (agrega y te lleva directo
   al carrito).

El subtotal se actualiza en vivo. Si elegís otro color, el talle y la cantidad se
reinician.

### 3. Revisar el carrito

En **/carrito** podés:

- **Cambiar la cantidad** de cada prenda con los botones `−` / `+`.
- **Quitar** un ítem con la `✕`.
- **Vaciar todo** el carrito.
- Ver el **total** de la compra en el resumen.

El carrito se guarda en tu navegador: si cerrás la pestaña, sigue ahí.

### 4. Enviar el pedido por WhatsApp

1. Tocá **"Enviar pedido por WhatsApp"**.
2. Se abre WhatsApp con un mensaje ya armado: prenda, talle exacto, color
   exacto, cantidad y subtotal por ítem, más el **total**.
3. Enviás el mensaje y el local confirma stock, formas de pago (Mercado Pago,
   transferencia, efectivo) y el envío o retiro, todo por chat.

> Si el botón muestra "El local todavía no configuró su número de WhatsApp",
> avisale al administrador que complete el número en
> `/admin/configuracion` (ver Parte 2, punto 5).

### 5. Otras páginas

- **/como-comprar** — guía visual de compra (pasos 1 a 4).
- **/contacto** — datos del local (dirección, email, redes) y botón de WhatsApp.
- **Botón flotante de WhatsApp** — presente en toda la tienda para consultas
  directas.
- **Botones de compartir** — en la ficha de producto para compartir la prenda
  en redes.

---

## Parte 2 · Panel de administración (para el admin)

El panel está en **/admin** y está protegido por login. Solo quien tenga el
usuario creado en Supabase puede entrar.

### 1. Ingresar

1. Entrá a `/admin`.
2. Iniciá sesión con tu **email y contraseña** (se crea en Supabase →
   Authentication → Users).
3. Una vez adentro ves el menú lateral: **Resumen, Productos, Categorías,
   Configuración** y la opción **"Ver tienda ↗"** para previsualizar.

### 2. Resumen (/admin)

- Tarjetas con el **total de productos, categorías y variantes**.
- Lista de **stock bajo (< 6 unidades)** para reponer: muestra color / talle y
  unidades. En rojo si está en 0.
- Atajo **"+ Nuevo producto"**.

### 3. Productos (/admin/productos)

La lista muestra foto, nombre, categoría, precio y estado. En cada producto hay
acciones rápidas:

- **★** — marcar/quitar como **destacado** (aparece primero en la tienda).
- **⧉** — **duplicar** el producto (útil para variantes de un mismo modelo).
- **Editar** — abrir el formulario completo.
- **Eliminar** — borra el producto y sus variantes/fotos (pide confirmación).
- El badge **"oculto"** indica un producto que no se ve en la tienda.

#### Crear / editar un producto

El formulario (botón **"+ Nuevo producto"** o **Editar**) tiene 3 secciones:

**a) Datos básicos**
- **Nombre*** — obligatorio.
- **URL (slug)** — se genera solo desde el nombre; es la dirección del producto.
- **Precio ($)*** — obligatorio.
- **Precio antes** — opcional; si es mayor que el precio actual se muestra el
  descuento y el badge "OFERTA".
- **Categoría** — seleccionar del menú (opcional).
- **Descripción** — composición, tela, cuidados…
- **Visible en la tienda** — si está desmarcado, el producto queda oculto.
- **Destacado** — aparece primero con ★.

**b) Fotos**

- Subí una o varias fotos a la vez (JPG, PNG, WEBP, AVIF · hasta 5 MB).
- Elegí el **color por defecto** para las fotos que vas a subir, y después podés
  cambiarlo foto por foto con el selector debajo de cada imagen.
- La foto en la posición 0 lleva el badge **"PORTADA"** (es la que se ve en la
  grilla). Usá las flechas **← →** para reordenar.
- La `✕` elimina la foto.

**c) Stock por color y talle**

- Agregá **colores** (con un selector para elegir el tono del botón) y **talles**
  con el campo y el botón `+` (Enter también agrega).
- Aparece una **tabla Color × Talle**: poné el stock de cada combinación.
- Las combinaciones con 0 quedan deshabilitadas (talladas) en la tienda.

Al final: **Cancelar** (vuelve atrás) o **Guardar cambios / Crear producto**.

### 4. Categorías (/admin/categorias)

- **Crear** una categoría: nombre + orden (número para ordenar en la grilla).
- **Editar** nombre u orden de una existente.
- **Eliminar** borra la categoría; los productos que la usaban quedan **sin
  categoría** (no se borran).

> El `slug` de la categoría se genera del nombre y es la URL del filtro
> (`/?cat=<slug>`).

### 5. Configuración (/admin/configuracion)

Una sola página con todo lo general. Tocá **"Guardar cambios"** al final.

**Información general**
- **Nombre del local** — se usa en mensajes y textos.
- **WhatsApp (número)*** — el más importante. Formato internacional **sin `+`**,
  p. ej. `5491123456789`. Sin este número, el carrito no puede armar el enlace
  y muestra el aviso de que falta configurarlo.
- **Email** y **Dirección del local** — se muestran en /contacto.
- **Barra de anuncios** — texto arriba de todo (envíos, ofertas…). Si queda
  vacía, no se muestra.
- **Texto de presentación** — párrafo del hero de la página principal.

**Redes sociales**
- **Instagram, Facebook, TikTok** — URLs completas. El link de Instagram además
  habilita el bloque del feed embebido en la home.

**Logo y banner**
- **Logo** — PNG, WEBP o SVG; se ve en el header de la tienda.
- **Banner (home)** — JPG, PNG o WEBP; se usa de fondo en el hero.

### 6. Cerrar sesión

Botón **"Cerrar sesión" / "Salir"** en la esquina inferior del menú lateral
(arriba a la derecha en pantallas chicas).

---

## Glosario rápido

| Término          | Qué significa                                          |
| ---------------- | ------------------------------------------------------ |
| **Slug**         | Parte de la URL que identifica al producto/categoría   |
| **Variante**     | Combinación color × talle con su propio stock          |
| **Destacado**    | Producto que aparece primero en la tienda (★)          |
| **Stock bajo**   | Variantes con menos de 6 unidades (alerta en Resumen)  |
| **Oculto**       | Producto cargado pero no visible en la tienda          |
| **PORTADA**      | Foto principal del producto (la primera, en la grilla) |
