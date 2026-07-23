import React from 'react';
import styles from './InfoSection.module.css';

// Import images
import imgCar1 from '../../assets/images/WhatsApp_Image_2025-07-26_at_10_27_58_AM.webp';
import imgCar2 from '../../assets/images/WhatsApp_Image_2025-08-05_at_10_26_02_AM_1.webp';
import bannerBg from '../../assets/images/9992a2_653f53e3a1324d25b51d4bd0854589a4_mv2.webp';

// Import partner logo images
import logo1 from '../../assets/images/2c5d2d17-9dad-4a8a-af30-4cacd335c11c.webp';
import logo2 from '../../assets/images/e9b30a1b-5296-40a0-ad0c-997ec3d34d56.webp';
import logo3 from '../../assets/images/886664c0-691c-4aaf-94d6-d8fe70a7ac78.webp';
import logo4 from '../../assets/images/4e8429f3-7491-4755-ab5d-43691d073fab.webp';

export default function InfoSection() {
  return (
    <section id="mision-vision" className={styles.infoSection}>
      <div className={styles.container}>
        
        {/* Mission and Vision Grid */}
        <div className={styles.misionVisionGrid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <span className={styles.cardIcon}>🎯</span> Misión
            </h3>
            <p className={styles.cardText}>
              Ofrecer a nuestros clientes una experiencia excepcional en la adquisición de vehículos, 
              brindando un servicio de alta calidad, transparencia y confianza. Nos comprometemos a 
              superar las expectativas de movilidad de cada persona que confía en nosotros.
            </p>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <span className={styles.cardIcon}>👁️</span> Visión
            </h3>
            <p className={styles.cardText}>
              Ser la concesionaria líder y referente en la región de Bosque Esmeralda, 
              reconocida por la excelencia de nuestras unidades, el profesionalismo de nuestro equipo 
              y la satisfacción garantizada de todos nuestros clientes.
            </p>
          </div>
        </div>

        {/* Gallery / Showroom Section */}
        <div className={styles.gallerySection}>
          <h2 className={styles.galleryTitle}>Clientes Satisfechos</h2>
          <p className={styles.gallerySubtitle}>
            Nuestra mayor recompensa es ver sonreír a quienes encuentran su auto ideal con nosotros. 
            Te acompañamos en cada etapa del camino.
          </p>

          <div className={styles.imageGrid}>
            <div className={styles.gridItem}>
              <img src={imgCar1} alt="Vehículo entregado Autovía Esmeralda" className={styles.gridImage} />
            </div>
            <div className={styles.gridItem}>
              <img src={imgCar2} alt="Cliente Autovía Esmeralda" className={styles.gridImage} />
            </div>
          </div>
        </div>

        {/* Middle Banner Section */}
        <div className={styles.middleBanner}>
          <img src={bannerBg} alt="Autovía Esmeralda Banner" className={styles.bannerBg} />
          <div className={styles.bannerContent}>
            <h2 className={styles.bannerTitle}>Excelencia sobre ruedas</h2>
            <p className={styles.bannerText}>Contáctanos y consigue el auto de tus sueños</p>
            <a 
              href="https://wa.me/525554340686?text=Hola,%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20autos%20disponibles."
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.bannerText + ' btn'} 
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--accent-red)',
                color: '#ffffff',
                padding: '12px 30px',
                borderRadius: '4px',
                fontSize: '1rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                margin: 0
              }}
            >
              Enviar WhatsApp
            </a>
          </div>
        </div>

        {/* Partner / Brands Section */}
        <div className={styles.partnerLogos}>
          <img src={logo1} alt="Logo Partner 1" className={styles.partnerLogo} />
          <img src={logo2} alt="Logo Partner 2" className={styles.partnerLogo} />
          <img src={logo3} alt="Logo Partner 3" className={styles.partnerLogo} />
          <img src={logo4} alt="Logo Partner 4" className={styles.partnerLogo} />
        </div>

      </div>
    </section>
  );
}
