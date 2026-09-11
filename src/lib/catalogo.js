import { useEffect, useState } from 'react';
import { DASHBOARD_URL } from './dashboardUrl';

/* autovia-dashboard es otro proyecto de Vercel; /api/catalogo ya está
   pensado para consumirse desde acá (CORS abierto, sin sesión) — ver el
   comentario de esa función en ese repo para el contrato completo. */
const CATALOGO_URL = `${DASHBOARD_URL}/api/catalogo`;

/* Carga el catálogo una sola vez por sesión de la página: los tres lugares
   que lo necesitan (Home destacados, Inventario, ficha de detalle) piden
   el mismo array completo, así que se cachea en memoria del módulo en vez
   de repetir el fetch en cada componente que se monta. */
let cache = null;
let promesaEnCurso = null;

function pedirCatalogo() {
  if (cache) return Promise.resolve(cache);
  if (!promesaEnCurso) {
    promesaEnCurso = fetch(CATALOGO_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`El catálogo respondió ${r.status}`);
        return r.json();
      })
      .then((autos) => {
        cache = autos;
        return autos;
      })
      .finally(() => { promesaEnCurso = null; });
  }
  return promesaEnCurso;
}

/* {autos, cargando, error} — autos es [] mientras carga o si falla, para
   que los componentes no tengan que revisar null en cada render. */
export function useCatalogo() {
  const [autos, setAutos] = useState(cache || []);
  const [cargando, setCargando] = useState(!cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache) return;
    let vivo = true;
    pedirCatalogo()
      .then((data) => { if (vivo) setAutos(data); })
      .catch((e) => { if (vivo) setError(e); })
      .finally(() => { if (vivo) setCargando(false); });
    return () => { vivo = false; };
  }, []);

  return { autos, cargando, error };
}
