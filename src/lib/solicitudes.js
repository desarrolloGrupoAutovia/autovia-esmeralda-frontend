/* Solicitud de financiamiento: se crea apenas se verifica el OTP y se va
   completando paso a paso, servida por /api/solicitudes de autovia-dashboard.
   Sin sesión — el celular verificado es la única prueba de identidad. */
import { DASHBOARD_URL } from './dashboardUrl';

const SOLICITUDES_URL = `${DASHBOARD_URL}/api/solicitudes`;

async function llamar(metodo, query, cuerpo) {
  const r = await fetch(`${SOLICITUDES_URL}${query || ''}`, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || 'No se pudo guardar la solicitud.');
  return data;
}

export async function crearSolicitud({ celular, autoSlug, autoNombre, autoPrecio, enganchePct, plazoMeses, pagoMensual }) {
  const data = await llamar('POST', '', {
    celular, autoSlug, autoNombre, autoPrecio, enganchePct, plazoMeses, pagoMensual,
  });
  return data.id;
}

export function actualizarSolicitud(id, celular, paso, datos) {
  return llamar('PUT', `?id=${encodeURIComponent(id)}`, { celular, paso, datos });
}

/* Paso 4: OCR de frente y reverso de la INE contra los datos ya
   capturados. El backend responde de inmediato (no espera a VerificaMex)
   y sigue verificando en segundo plano — usar consultarEstadoIne() para
   hacer polling hasta que termine. Si no coincidiera, la solicitud queda
   marcada para revisión manual del lado del dashboard, sin que el
   cliente se entere en este último paso. */
export function verificarIneSolicitud(id, celular, ineFrente, ineReverso) {
  return llamar('PUT', `?id=${encodeURIComponent(id)}&accion=ine`, { celular, ineFrente, ineReverso });
}

/* Polling del resultado de verificarIneSolicitud(). listo=false mientras
   sigue en 'verificando_ine'; listo=true en cuanto cambia a cualquier
   otro estado (completa, revision_ine, etc). */
export async function consultarEstadoIne(id, celular) {
  const r = await fetch(
    `${SOLICITUDES_URL}?id=${encodeURIComponent(id)}&celular=${encodeURIComponent(celular)}&accion=estado-ine`
  );
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || 'No se pudo consultar el estado de tu verificación.');
  return data;
}

/* Link de seguimiento que se le puede pasar al cliente: /seguimiento/:id?celular=...
   Solo lectura, sin sesión — el celular es la prueba de que es su solicitud. */
export async function consultarSeguimiento(id, celular) {
  const r = await fetch(
    `${SOLICITUDES_URL}?id=${encodeURIComponent(id)}&celular=${encodeURIComponent(celular)}&accion=seguimiento`
  );
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || 'No encontramos esa solicitud.');
  return data;
}
