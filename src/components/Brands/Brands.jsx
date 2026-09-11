import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Brands.module.css';
import { useCatalogo } from '../../lib/catalogo';
import { marcasConConteo, tituloMarca } from '../../lib/cars';

export default function Brands() {
  const ref = useRef(null);
  const { autos } = useCatalogo();
  const marcas = marcasConConteo(autos);

  const scrollBy = (dx) => ref.current?.scrollBy({ left: dx, behavior: 'smooth' });

  if (!marcas.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title}>Marcas en inventario</h2>
        <div className={styles.navBtns}>
          <button className={styles.navBtn} onClick={() => scrollBy(-558)} aria-label="Anterior">&#8592;</button>
          <button className={styles.navBtn} onClick={() => scrollBy(558)} aria-label="Siguiente">&#8594;</button>
        </div>
      </div>

      <div className={styles.scroller} ref={ref}>
        {marcas.map(({ marca }) => (
          <Link
            key={marca}
            to={`/inventario?marca=${encodeURIComponent(marca)}`}
            className={styles.card}
          >
            {tituloMarca(marca)}
          </Link>
        ))}
      </div>
    </section>
  );
}
