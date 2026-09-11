import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CarCard.module.css';
import { getCarCoverUrl, parsePrice, parseAnio, parseKm, tituloCorto } from '../../lib/cars';
import { mxn, mensualidadEstimada } from '../../lib/credito';

/* Tarjeta de auto reutilizada en Home (destacados), Inventario y "unidades
   similares" de CarDetail: misma imagen 16/11, badge, precio de contado y
   mensualidad estimada de Autovía Credit. */
export default function CarCard({ car }) {
  const price = parsePrice(car.price);
  const anio = parseAnio(car.name);
  const km = parseKm(car.km);
  const mensualidad = mensualidadEstimada(price);

  return (
    <Link to={`/inventario/${car.slug}`} className={styles.card}>
      <div className={styles.imgWrap}>
        {getCarCoverUrl(car) ? (
          <img src={getCarCoverUrl(car)} alt={car.name} className={styles.img} />
        ) : (
          <div className={styles.imgPlaceholder}></div>
        )}
        <span className={styles.badge}>{car.badge || 'Certificado'}</span>
      </div>

      <div className={styles.body}>
        <div>
          <div className={styles.meta}>
            {[anio, km != null ? `${km.toLocaleString('es-MX')} km` : null, car.transmision]
              .filter(Boolean).join(' · ')}
          </div>
          <div className={styles.name}>{tituloCorto(car)}</div>
        </div>

        <div className={styles.footer}>
          <div>
            <div className={styles.priceLabel}>Contado</div>
            <div className={styles.price}>{mxn(price)}</div>
          </div>
          <div className={styles.creditBox}>
            <span className={styles.creditLabel}>Autovía Credit</span>
            <span className={styles.creditValue}>
              {mxn(mensualidad)}<span className={styles.creditPer}>/mes</span>
            </span>
          </div>
        </div>

        <span className={styles.cta}>Ver ficha completa</span>
      </div>
    </Link>
  );
}
