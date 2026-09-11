/* Verificación del celular por WhatsApp antes de dejar avanzar el
   formulario de solicitud de crédito — mismo patrón que ya usa Movinex
   (WhatsappOtpService): un código de 6 dígitos por plantilla de
   Authentication, servido por /api/otp de autovia-dashboard. */
import { DASHBOARD_URL } from './dashboardUrl';

const OTP_URL = `${DASHBOARD_URL}/api/otp`;

async function llamar(accion, cuerpo) {
  const r = await fetch(`${OTP_URL}?accion=${accion}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || 'No se pudo completar la verificación.');
  return data;
}

export function enviarOtp(celular) {
  return llamar('enviar', { celular });
}

export async function verificarOtp(celular, codigo) {
  const data = await llamar('verificar', { celular, codigo });
  return !!data.verificado;
}
