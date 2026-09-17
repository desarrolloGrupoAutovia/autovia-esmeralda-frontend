import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import styles from './Seguimiento.module.css';
import { consultarSeguimiento } from '../../lib/solicitudes';

const PASOS = ['Verificación', 'Datos personales', 'Domicilio', 'Contacto', 'Identidad (INE)'];

const ETIQUETA_ESTADO = {
  incompleta: 'Incompleta',
  completa: 'Completa',
  revision_ine: 'En revisión',
  contactada: 'Contactada',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
};

export default function Seguimiento() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const celular = searchParams.get('celular') || '';

  const [estado, setEstado] = useState('cargando'); // cargando | error | listo
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !celular) {
      setEstado('error');
      setError('Este link no es válido. Revisa que lo hayas copiado completo.');
      return;
    }
    consultarSeguimiento(id, celular)
      .then((d) => { setDatos(d); setEstado('listo'); })
      .catch((e) => { setError(e.message || 'No encontramos esa solicitud.'); setEstado('error'); });
  }, [id, celular]);

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        {estado === 'cargando' && <p className={styles.muted}>Buscando tu solicitud…</p>}

        {estado === 'error' && (
          <>
            <h1 className={styles.title}>No pudimos encontrar tu solicitud</h1>
            <p className={styles.muted}>{error}</p>
            <Link to="/" className={styles.btn}>Ir al inicio</Link>
          </>
        )}

        {estado === 'listo' && datos && (
          <>
            <span className={styles.badge}>{ETIQUETA_ESTADO[datos.estado] || datos.estado}</span>
            <h1 className={styles.title}>{datos.autoNombre || 'Tu solicitud de financiamiento'}</h1>

            <div className={styles.pasos}>
              {PASOS.map((p, i) => (
                <div key={p} className={styles.pasoRow}>
                  <span className={`${styles.dot} ${i < datos.pasoAlcanzado ? styles.dotOn : ''}`}></span>
                  <span className={i < datos.pasoAlcanzado ? styles.pasoOn : styles.pasoOff}>{p}</span>
                </div>
              ))}
            </div>

            <p className={styles.mensaje}>{datos.mensaje}</p>

            <a
              href="https://wa.me/525554340686"
              target="_blank" rel="noreferrer"
              className={styles.btn}
            >
              Escribirnos por WhatsApp
            </a>
          </>
        )}
      </div>
    </section>
  );
}
