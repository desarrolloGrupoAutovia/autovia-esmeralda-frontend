import React from 'react';
import styles from './Location.module.css';
import locationImage from '../../assets/images/WhatsApp_Image_2025-08-05_at_12_17_26_PM.webp';

export default function Location() {
  return (
    <section id="sucursal" className={styles.locationSection}>
      <div className={styles.container}>
        <div className={styles.details}>
          <h2 className={styles.title}>Sucursal</h2>
          
          <div className={styles.infoBlock}>
            <span className={styles.label}>Dirección</span>
            <p className={styles.text}>
              Bosque de Arrayan 1, Interior 301 - N1 Bosque Esmeralda. <br />
              CP. 52930. Ciudad López Mateos. Edo. de México. City Center.
            </p>
          </div>

          <div className={styles.infoBlock}>
            <span className={styles.label}>Horarios</span>
            <p className={styles.text}>
              Lunes - Viernes: 09:00 a 18:00 hrs. <br />
              Sábado: 09:00 a 17:00 hrs.
            </p>
          </div>

          <a 
            href="https://maps.app.goo.gl/sfUqacY" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.mapBtn}
          >
            Ver en el mapa 🗺️
          </a>
        </div>

        <div className={styles.imageContainer}>
          <img 
            src={locationImage} 
            alt="Ubicación de Autovía Esmeralda" 
            className={styles.image} 
          />
        </div>
      </div>
    </section>
  );
}
