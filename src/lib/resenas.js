import { useEffect, useState } from 'react';
import { DASHBOARD_URL } from './dashboardUrl';

/* /api/resenas ya está pensado para consumirse desde acá (CORS abierto,
   sin sesión) — trae las reseñas reales de Google del negocio. */
const RESENAS_URL = `${DASHBOARD_URL}/api/resenas`;

let cache = null;
let promesaEnCurso = null;

function pedirResenas() {
  if (cache) return Promise.resolve(cache);
  if (!promesaEnCurso) {
    promesaEnCurso = fetch(RESENAS_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`Las reseñas respondieron ${r.status}`);
        return r.json();
      })
      .then((data) => {
        cache = data;
        return data;
      })
      .finally(() => { promesaEnCurso = null; });
  }
  return promesaEnCurso;
}

/* {resenas, rating, totalResenas, cargando, error} — resenas es [] mientras
   carga o si falla, para que Testimonials no tenga que revisar null. */
export function useResenas() {
  const [resenas, setResenas] = useState(cache?.resenas || []);
  const [rating, setRating] = useState(cache?.rating ?? null);
  const [totalResenas, setTotalResenas] = useState(cache?.totalResenas ?? null);
  const [cargando, setCargando] = useState(!cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache) return;
    let vivo = true;
    pedirResenas()
      .then((data) => {
        if (!vivo) return;
        setResenas(data.resenas || []);
        setRating(data.rating ?? null);
        setTotalResenas(data.totalResenas ?? null);
      })
      .catch((e) => { if (vivo) setError(e); })
      .finally(() => { if (vivo) setCargando(false); });
    return () => { vivo = false; };
  }, []);

  return { resenas, rating, totalResenas, cargando, error };
}
