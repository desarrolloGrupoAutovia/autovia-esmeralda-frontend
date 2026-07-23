import React from 'react';
import styles from './Hero.module.css';
import bgImage from '../../assets/images/9992a2_ea59b43f57714f789ce11a1264a66f18_mv2.webp';

export default function Hero() {
  return (
    <section id="principal" className={styles.hero}>
      <img src={bgImage} alt="Showroom Autovía Esmeralda" className={styles.bgImage} />
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>Autovía Esmeralda</h1>
        <p className={styles.subtitle}>Excelencia sobre ruedas</p>
        <a 
          href="https://wa.me/525554340686?text=Hola,%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20autos%20disponibles."
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.ctaBtn}
        >
          Contáctanos y consigue el auto de tus sueños
        </a>
      </div>
    </section>
  );
}
