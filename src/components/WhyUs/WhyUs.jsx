import React from 'react';
import styles from './WhyUs.module.css';

const RAZONES = [
  { tag: 'GARANTÍA', title: 'Hasta 1 año de respaldo', body: 'Cobertura de motor y transmisión por escrito: 1 año o 10,000 km en unidades 2018 en adelante, 3 meses o 2,000 km en modelos anteriores.' },
  { tag: 'CRÉDITO', title: 'Financiera propia', body: 'Aprobamos internamente: menos requisitos, respuesta en 15 minutos y sin restricción de antigüedad en el auto.' },
  { tag: 'GRUPO', title: 'Más de 15 años en el sector', body: 'Respaldo de un grupo automotriz mexicano con operación en el Estado de México.' },
  { tag: 'LEGAL', title: 'Certeza documental', body: 'Revisión legal completa del vehículo: factura, pagos, REPUVE, reportes y más.' },
];

export default function WhyUs() {
  return (
    <section id="nosotros" className={styles.section}>
      <h2 className={styles.title}>Por qué elegirnos</h2>
      <div className={styles.grid}>
        {RAZONES.map((r) => (
          <div key={r.tag} className={styles.card}>
            <div className={styles.tag}>{r.tag}</div>
            <div className={styles.cardTitle}>{r.title}</div>
            <div className={styles.body}>{r.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
