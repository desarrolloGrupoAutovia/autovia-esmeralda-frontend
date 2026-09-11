import React, { useRef } from 'react';
import { useResenas } from '../../lib/resenas';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const ref = useRef(null);
  const { resenas, rating, totalResenas, cargando, error } = useResenas();

  const scrollBy = (dx) => ref.current?.scrollBy({ left: dx, behavior: 'smooth' });

  if (!cargando && (error || resenas.length === 0)) return null;

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <div>
          <h2 className={styles.title}>Clientes de Autovía</h2>
          {rating != null && (
            <div className={styles.rating}>
              {rating.toFixed(1)}★ en Google {totalResenas != null && `· ${totalResenas} reseñas`}
            </div>
          )}
        </div>
        <div className={styles.navBtns}>
          <button className={styles.navBtn} onClick={() => scrollBy(-832)} aria-label="Anterior">&#8592;</button>
          <button className={styles.navBtn} onClick={() => scrollBy(832)} aria-label="Siguiente">&#8594;</button>
        </div>
      </div>

      <div className={styles.scroller} ref={ref}>
        {resenas.map((r) => (
          <div key={r.autor} className={styles.card}>
            <div className={styles.quote}>{r.texto}</div>
            <div className={styles.person}>
              <img className={styles.avatar} src={r.foto} alt="" referrerPolicy="no-referrer" />
              <div>
                <div className={styles.name}>{r.autor}</div>
                <div className={styles.car}>{r.cuando}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
