import React from 'react';
import styles from './Location.module.css';

const MAPS_EMBED_SRC =
  'https://maps.google.com/maps?q=Autov%C3%ADa%20Esmeralda%2C%20Bosque%20de%20Array%C3%A1n%201%2C%20Bosque%20Esmeralda%2C%20Ciudad%20L%C3%B3pez%20Mateos&t=k&z=17&output=embed';

export default function Location() {
  return (
    <section id="contacto" className={styles.section}>
      <div className={styles.card}>
        <div className={styles.info}>
          <h2 className={styles.title}>Showroom Esmeralda</h2>

          <div className={styles.blocks}>
            <div>
              <div className={styles.label}>Dirección</div>
              <div className={styles.value}>
                Bosque de Arrayán 1, Int. 301 N1<br />
                Bosque Esmeralda, 52930 Cdad. López Mateos, Méx.<br />
                Dentro del Centro Comercial City Center Bosque Esmeralda
              </div>
            </div>
            <div>
              <div className={styles.label}>Teléfono / WhatsApp</div>
              <div className={styles.value}>55 5434 0686</div>
            </div>
            <div>
              <div className={styles.label}>Horario</div>
              <div className={styles.value}>
                Abrimos los 7 días<br />
                Lunes a domingo · 9:00 – 18:00
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/525554340686?text=Hola,%20quiero%20agendar%20una%20visita%20al%20showroom."
            target="_blank" rel="noopener noreferrer"
            className={styles.cta}
          >
            Agendar visita por WhatsApp
          </a>
        </div>

        <div className={styles.mapWrap}>
          <iframe
            className={styles.mapFrame}
            src={MAPS_EMBED_SRC}
            title="Ubicación de Autovía Esmeralda"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
}
