import React from 'react';
import styles from './Warranty.module.css';

const PUNTOS = [
  { code: '01', name: 'Motor', note: 'Compresión, fugas, ruidos, etc.' },
  { code: '02', name: 'Frenos', note: 'Discos, balatas, líquido, etc.' },
  { code: '03', name: 'Suspensión', note: 'Amortiguadores, bujes, etc.' },
  { code: '04', name: 'Transmisión', note: 'Cambios, estado del aceite, etc.' },
  { code: '05', name: 'Eléctrico', note: 'Batería, alternador, luces, etc.' },
  { code: '06', name: 'Carrocería', note: 'Pintura, holguras, golpes, etc.' },
  { code: '07', name: 'Interiores', note: 'Clima, tablero, multimedia, etc.' },
  { code: '08', name: 'Documentos', note: 'Factura, adeudos, REPUVE, etc.' },
];

export default function Warranty() {
  return (
    <section id="garantia" className={styles.section}>
      <div className={styles.grid}>
        <div>
          <h2 className={styles.title}>Dos niveles de certificación, según el año</h2>
          <p className={styles.lead}>
            Ningún auto sale a piso sin pasar la revisión multipunto de nuestro taller. Solo aceptamos unidades que
            cumplen con todos los estándares de calidad; si algo no pasa, la unidad no entra a nuestro inventario.
            La cobertura depende del año de la unidad.
          </p>

          <div className={styles.levels}>
            <div className={`${styles.level} ${styles.levelActive}`}>
              <div className={styles.levelTag}>2018 en adelante</div>
              <div className={styles.levelValue}>1 año</div>
              <div className={styles.levelDetail}>o 10,000 km de garantía</div>
            </div>
            <div className={styles.level}>
              <div className={styles.levelTagMuted}>2017 o anterior</div>
              <div className={styles.levelValue}>3 meses</div>
              <div className={styles.levelDetail}>o 2,000 km de garantía</div>
            </div>
          </div>

          <div className={styles.checks}>
            <div className={styles.checkRow}><span className={styles.dot}></span> Certificado escrito por unidad</div>
            <div className={styles.checkRow}><span className={styles.dot}></span> Verificación de factura y adeudos</div>
            <div className={styles.checkRow}><span className={styles.dot}></span> Asesoría en trámite de placas y tenencia</div>
          </div>
        </div>

        <div className={styles.pointsGrid}>
          {PUNTOS.map((pt) => (
            <div key={pt.code} className={styles.pointCard}>
              <div className={styles.pointCode}>{pt.code}</div>
              <div className={styles.pointName}>{pt.name}</div>
              <div className={styles.pointNote}>{pt.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
