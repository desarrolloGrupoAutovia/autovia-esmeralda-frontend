import React, { useRef } from 'react';
import styles from './Testimonials.module.css';

/* PENDIENTE: estos son testimonios de ejemplo del mockup de diseño, no
   reseñas reales. Falta conectar con las reseñas de Google del negocio
   (vía Google Places API con el Place ID de Autovía Esmeralda) para
   reemplazarlos por contenido real — decisión pendiente de cómo traerlos. */
const TESTIMONIOS = [
  { name: 'Mariana Robles', car: 'Nissan Versa 2023', quote: 'Me aprobaron el crédito el mismo día con enganche del 35%. Me explicaron la mensualidad exacta antes de firmar, sin sorpresas.' },
  { name: 'Óscar Villalobos', car: 'Mazda CX-5 2022', quote: 'Lo que me convenció fue la revisión del taller. Pedí el certificado, lo leí completo y coincidía con lo que traía el auto.' },
  { name: 'Daniela Fuentes', car: 'Kia Rio 2023', quote: 'Mi historial no era perfecto y aun así me aprobaron con Autovía Credit. Me dijeron desde el principio qué enganche necesitaba y no cambió después.' },
  { name: 'Luis Ángel Mora', car: 'Toyota Hilux 2022', quote: 'Entrega inmediata y con placas listas. La camioneta llevaba dos años trabajando conmigo sin un solo detalle.' },
];

export default function Testimonials() {
  const ref = useRef(null);

  const scrollBy = (dx) => ref.current?.scrollBy({ left: dx, behavior: 'smooth' });

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title}>Clientes de Autovía</h2>
        <div className={styles.navBtns}>
          <button className={styles.navBtn} onClick={() => scrollBy(-832)} aria-label="Anterior">&#8592;</button>
          <button className={styles.navBtn} onClick={() => scrollBy(832)} aria-label="Siguiente">&#8594;</button>
        </div>
      </div>

      <div className={styles.scroller} ref={ref}>
        {TESTIMONIOS.map((t) => (
          <div key={t.name} className={styles.card}>
            <div className={styles.quote}>{t.quote}</div>
            <div className={styles.person}>
              <div className={styles.avatar}></div>
              <div>
                <div className={styles.name}>{t.name}</div>
                <div className={styles.car}>{t.car}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
