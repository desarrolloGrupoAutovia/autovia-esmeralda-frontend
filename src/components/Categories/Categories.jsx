import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Categories.module.css';
import { useCatalogo } from '../../lib/catalogo';
import imgSedan from '../../assets/images/categoria-sedan.webp';
import imgSuv from '../../assets/images/categoria-suv.webp';
import imgPickup from '../../assets/images/categoria-pickup.webp';
import imgHatchback from '../../assets/images/categoria-hatchback.webp';
import imgCoupe from '../../assets/images/categoria-coupe.webp';
import imgVan from '../../assets/images/categoria-van.webp';
import imgConvertible from '../../assets/images/categoria-convertible.webp';
import imgCompacto from '../../assets/images/categoria-compacto.webp';
import { useArrastreHorizontal } from '../../lib/useArrastreHorizontal';

/* Por carrocería real (car.carroceria, tal como la captura el equipo de
   ventas en el dashboard), no por el agrupado Autos/Camionetas que usa
   el filtro de Inventory.jsx — son dos clasificaciones distintas del
   mismo auto, cada una para su propio propósito. */
const TIPOS = [
  { value: 'Sedán', label: 'Sedán', img: imgSedan },
  { value: 'SUV', label: 'SUV', img: imgSuv },
  { value: 'Pickup', label: 'Pickup', img: imgPickup },
  { value: 'Hatchback', label: 'Hatchback', img: imgHatchback },
  { value: 'Coupé', label: 'Coupé', img: imgCoupe },
  { value: 'Van', label: 'Van', img: imgVan },
  { value: 'Convertible', label: 'Convertible', img: imgConvertible },
  { value: 'Compacto', label: 'Compacto', img: imgCompacto },
];

export default function Categories() {
  const ref = useRef(null);
  const { handlers } = useArrastreHorizontal(ref);
  const { autos } = useCatalogo();

  const categorias = TIPOS.map((t) => ({
    ...t,
    count: autos.filter((c) => c.carroceria === t.value).length,
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

      <div className={styles.scroller} ref={ref} {...handlers}>
        {categorias.map((cat) => (
          <Link
            key={cat.value}
            to={`/inventario?carroceria=${encodeURIComponent(cat.value)}`}
            className={styles.card}
            style={{ backgroundImage: `url(${cat.img})` }}
          >
            <span className={styles.name}>{cat.label}</span>
            <span className={styles.count}>{cat.count} disponibles</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
