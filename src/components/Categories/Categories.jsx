import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Categories.module.css';
import { useCatalogo } from '../../lib/catalogo';

const TIPOS = [
  { value: 'AUTOS', label: 'Autos' },
  { value: 'CAMIONETAS', label: 'Camionetas' },
];

export default function Categories() {
  const ref = useRef(null);
  const { autos } = useCatalogo();

  const categorias = TIPOS.map((t) => ({
    ...t,
    count: autos.filter((c) => c.category === t.value).length,
  })).filter((c) => c.count > 0);

  const scrollBy = (dx) => ref.current?.scrollBy({ left: dx, behavior: 'smooth' });

  if (!categorias.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <div>
          <h2 className={styles.title}>Busca por tipo de auto</h2>
          <p className={styles.subtitle}>
            Todo nuestro inventario está en showroom, listo para entrega inmediata y financiado con Autovía Credit.
          </p>
        </div>
        <div className={styles.navBtns}>
          <button className={styles.navBtn} onClick={() => scrollBy(-572)} aria-label="Anterior">&#8592;</button>
          <button className={styles.navBtn} onClick={() => scrollBy(572)} aria-label="Siguiente">&#8594;</button>
        </div>
      </div>

      <div className={styles.scroller} ref={ref}>
        {categorias.map((cat) => (
          <Link
            key={cat.value}
            to={`/inventario?tipo=${cat.value}`}
            className={styles.card}
          >
            <span className={styles.name}>{cat.label}</span>
            <span className={styles.count}>{cat.count} disponibles</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
