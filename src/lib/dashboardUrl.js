/* URL base de autovia-dashboard (otro proyecto de Vercel, dueño de la base
   de datos real). Se puede sobreescribir con VITE_DASHBOARD_URL en .env.local
   para apuntar al backend corriendo en local (`vercel dev`) mientras se
   prueba algo — sin esto, cada prueba local le pega a producción. */
export const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'https://autovia-dashboard.vercel.app';
