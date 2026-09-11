import React from 'react';
import { Link } from 'react-router-dom';
import styles from './FeaturedCatalog.module.css';
import CarCard from '../CarCard/CarCard';
import { useCatalogo } from '../../lib/catalogo';

const CANTIDAD_DESTACADA = 6;

export default function FeaturedCatalog() {
  const { autos, cargando } = useCatalogo();
  const destacados = autos.slice(0, CANTIDAD_DESTACADA);

  if (cargando || !destacados.length) return null;

  return (
    <section id="inventario" className={styles.section}>
      <div className={styles.head}>
        <div>
          <h2 className={styles.title}>Catálogo destacado</h2>
          <p className={styles.subtitle}>Precio de contado y mensualidad estimada con Autovía Credit.</p>
        </div>
        <Link to="/inventario" className={styles.verTodo}>
          Ver todo el inventario &#8594;
        </Link>
      </div>

      <div className={styles.grid}>
        {destacados.map((car) => (
          <CarCard key={car.slug} car={car} />
        ))}
      </div>
    </section>
  );
}
