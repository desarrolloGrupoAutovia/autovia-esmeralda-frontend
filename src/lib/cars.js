/* Utilidades compartidas para leer los autos que manda /api/catalogo de
   autovia-dashboard. El precio llega como número y el nombre ya viene
   armado ("MARCA MODELO VERSIÓN AÑO"), pero marca/año no vienen sueltos —
   se derivan del nombre aquí, igual que antes con el JSON estático, para
   no tener que tocar el resto de los componentes. */

/* Las fotos ya son URLs absolutas de Vercel Blob (o no existen: muchos
   autos dados de alta antes del módulo de fotos todavía no tienen). */
export function getCarImageUrl(url) {
  return url || '';
}

/* /api/catalogo ya ordena las fotos con la de categoría "portada" primero
   (ver payloadDe() en autovia-dashboard/api/catalogo.js), así que la
   primera del array siempre es la elegida para miniatura. Si el auto no
   tiene fotos todavía, CarCard/CarDetail pintan un placeholder. */
export function getCarCoverUrl(car) {
  return car.images?.[0] || '';
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

