/* Utilidades compartidas para leer los autos que manda /api/catalogo de
   autovia-dashboard. El precio llega como número y el nombre ya viene
   armado ("MARCA MODELO VERSIÓN AÑO"), pero marca/año no vienen sueltos —
   se derivan del nombre aquí, igual que antes con el JSON estático, para
   no tener que tocar el resto de los componentes. */

/* Las fotos originales del blob son de cámara de celular (~200KB-2MB,
   varios miles de píxeles de ancho). Pedirlas crudas para pintarlas en
   una miniatura de 132px hace que el navegador las achique él mismo, con
   un algoritmo pobre que las deja con aliasing — además de bajar el
   archivo entero al pedo.

   autovia-dashboard ya tiene habilitado el optimizador de imágenes de
   Vercel para este blob store (ver "images.remotePatterns" en su
   vercel.json), así que se le pide el ancho exacto que se va a pintar y
   devuelve un WebP redimensionado del lado del servidor (medido en una
   foto real: 189KB JPEG → 41KB WebP a w=420).

   El dominio va fijo y no usa DASHBOARD_URL a propósito: en local esa
   variable apunta a `vercel dev`, que no sirve /_vercel/image. */
const OPTIMIZADOR_URL = 'https://autovia-dashboard.vercel.app/_vercel/image';

/* Anchos que soporta el optimizador (los de "images.sizes" en el
   vercel.json del dashboard) — pedir uno que no esté en la lista da 400. */
const ANCHOS = [64, 96, 128, 210, 256, 420, 640, 828, 1080, 1920];

function anchoSoportado(ancho) {
  return ANCHOS.find((a) => a >= ancho) || ANCHOS[ANCHOS.length - 1];
}

/* x2 es el estándar para pantallas retina. No conviene subirlo a x3: los
   anchos disponibles saltan de 1080 a 1920, y a 1920 el WebP termina
   pesando lo mismo que el JPEG original (medido: 188.9KB en ambos), o
   sea que se pierde todo el beneficio.

   q=90 en vez del 75 que usa Vercel por defecto — cuesta pocos KB a
   estos anchos y evita el "sucio" de compresión en los detalles finos
   (llantas, parrillas, texto). */
const FACTOR_RETINA = 2;
const CALIDAD = 90;

function urlOptimizada(url, w) {
  return `${OPTIMIZADOR_URL}?url=${encodeURIComponent(url)}&w=${w}&q=${CALIDAD}`;
}

/* ancho: el ancho en CSS px del hueco donde se va a pintar la imagen. */
export function getCarImageUrl(url, ancho) {
  if (!url) return '';
  if (!ancho) return url;
  return urlOptimizada(url, anchoSoportado(ancho * FACTOR_RETINA));
}

/* Para una imagen cuyo ancho depende del viewport (una card que en la
   grilla de escritorio mide ~276px pero en móvil ocupa toda la pantalla)
   no alcanza con un solo ancho: elegir el más grande le hace bajar de más
   al escritorio. Con srcset + sizes el navegador baja el que le
   corresponde según su ancho real y su densidad de pantalla. */
export function getCarImageSrcSet(url, anchos) {
  if (!url) return '';
  return anchos
    .map((a) => anchoSoportado(a))
    .filter((w, i, arr) => arr.indexOf(w) === i)
    .map((w) => `${urlOptimizada(url, w)} ${w}w`)
    .join(', ');
}

/* /api/catalogo ya ordena las fotos con la de categoría "portada" primero
   (ver payloadDe() en autovia-dashboard/api/catalogo.js), así que la
   primera del array siempre es la elegida para miniatura. Si el auto no
   tiene fotos todavía, CarCard/CarDetail pintan un placeholder. */
export function getCarCoverUrl(car, ancho) {
  return getCarImageUrl(car.images?.[0], ancho);
}

export function getCarCoverSrcSet(car, anchos) {
  return getCarImageSrcSet(car.images?.[0], anchos);
}

export function parsePrice(priceStr) {
  if (typeof priceStr === 'number') return priceStr;
  return parseFloat(String(priceStr || '0').replace(/[^0-9.-]+/g, '')) || 0;
}

/* El nombre viene como "MARCA MODELO VERSIÓN AÑO" (ej. "AUDI A1 COOL 2016").
   La marca es la primera palabra; el año, los últimos 4 dígitos si los hay. */
export function parseMarca(name) {
  return String(name || '').trim().split(/\s+/)[0] || '';
}

export function parseAnio(name) {
  const m = String(name || '').match(/(19|20)\d{2}(?!.*\d)/);
  return m ? Number(m[0]) : null;
}

export function parseKm(kmStr) {
  const n = parseFloat(String(kmStr || '').replace(/[^0-9.-]+/g, ''));
  return isNaN(n) ? null : n;
}

/* Nombre "de exhibición": todo lo anterior al año, con formato título en vez
   de MAYÚSCULAS (el JSON fuente trae todo en mayúsculas). */
export function tituloCorto(car) {
  const anio = parseAnio(car.name);
  const sinAnio = anio ? car.name.replace(String(anio), '').trim() : car.name;
  return sinAnio
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* Algunas marcas no van en formato título simple (serían "Bmw", "Kia" queda
   bien pero "Bmw" no) — mismo problema que camelCase de siglas. */
const MARCAS_SIGLAS = new Set(['BMW', 'KIA', 'MG']);

export function tituloMarca(marca) {
  const m = String(marca || '').toUpperCase();
  if (MARCAS_SIGLAS.has(m)) return m;
  return m.charAt(0) + m.slice(1).toLowerCase();
}

/* Marcas presentes en una lista de autos, con cuántas unidades tiene cada
   una, ordenadas de más a menos inventario. */
export function marcasConConteo(autos) {
  const conteo = new Map();
  for (const car of autos) {
    const marca = parseMarca(car.name);
    if (!marca) continue;
    conteo.set(marca, (conteo.get(marca) || 0) + 1);
  }
  return [...conteo.entries()]
    .map(([marca, count]) => ({ marca, count }))
    .sort((a, b) => b.count - a.count || a.marca.localeCompare(b.marca));
}

