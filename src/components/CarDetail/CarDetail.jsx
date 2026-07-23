import React, { useState, useEffect } from 'react';
import styles from './CarDetail.module.css';
import carsDetailed from '../../assets/cars_detailed.json';

// Eager load all webp images recursively under assets/images/cars/
const carImageModules = import.meta.glob('../../assets/images/cars/**/*.webp', { eager: true });

export default function CarDetail({ carSlug, onBack }) {
  const [car, setCar] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    // Find car by slug
    const foundCar = carsDetailed.find(c => c.slug === carSlug);
    if (foundCar) {
      setCar(foundCar);
      setActiveImageIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [carSlug]);

  if (!car) {
    return (
      <section className={styles.detailSection}>
        <div className={styles.container}>
          <button className={styles.backBtn} onClick={onBack}>
            ← Volver al inventario
          </button>
          <div>Cargando datos del vehículo...</div>
        </div>
      </section>
    );
  }

  const getCarImageUrl = (imagePath) => {
    const fullPath = `../../assets/images/cars/${imagePath}`;
    return carImageModules[fullPath] ? carImageModules[fullPath].default : '';
  };

  // WhatsApp click handler with pre-filled message
  const whatsappUrl = `https://wa.me/525554340686?text=${encodeURIComponent(
    `Hola, estoy interesado en el vehículo ${car.name} (${car.price}) que vi en su sitio web de Autovía Esmeralda.`
  )}`;

  return (
    <section className={styles.detailSection}>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={onBack}>
          ← Volver al inventario
        </button>

        <div className={styles.layout}>
          {/* Gallery Section */}
          <div className={styles.gallery}>
            <div className={styles.mainImageWrapper}>
              <img 
                src={getCarImageUrl(car.images[activeImageIndex]) || `https://via.placeholder.com/800x600?text=${encodeURIComponent(car.name)}`} 
                alt={`${car.name} - Vista Principal`} 
                className={styles.mainImage}
              />
            </div>
            
            {car.images.length > 1 && (
              <div className={styles.thumbnails}>
                {car.images.map((imagePath, index) => (
                  <button 
                    key={index} 
                    className={`${styles.thumbWrapper} ${index === activeImageIndex ? styles.active : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img 
                      src={getCarImageUrl(imagePath)} 
                      alt={`${car.name} - Vista ${index + 1}`} 
                      className={styles.thumbImage}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Panel */}
          <div className={styles.detailsPanel}>
            <span className={styles.categoryTag}>{car.category}</span>
            <h1 className={styles.carName}>{car.name}</h1>
            <div className={styles.price}>{car.price}</div>

            {/* Specifications Grid */}
            <div className={styles.specsGrid}>
              {car.km && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Kilometraje</span>
                  <span className={styles.specValue}>{car.km} Km</span>
                </div>
              )}
              {car.motor && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Motor</span>
                  <span className={styles.specValue}>{car.motor}</span>
                </div>
              )}
              {car.potencia && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Potencia</span>
                  <span className={styles.specValue}>{car.potencia}</span>
                </div>
              )}
              {car.transmision && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Transmisión</span>
                  <span className={styles.specValue}>{car.transmision}</span>
                </div>
              )}
              {car.combustible && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Combustible</span>
                  <span className={styles.specValue}>{car.combustible}</span>
                </div>
              )}
              {car.capacidad && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Capacidad</span>
                  <span className={styles.specValue}>{car.capacidad}</span>
                </div>
              )}
              {car.traccion && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Tracción</span>
                  <span className={styles.specValue}>{car.traccion}</span>
                </div>
              )}
            </div>

            {/* Equipment Description */}
            {car.equipamiento && (
              <div className={styles.equipmentSection}>
                <h3 className={styles.sectionTitle}>Equipamiento & Detalles</h3>
                <p className={styles.equipmentText}>{car.equipamiento}</p>
              </div>
            )}

            {/* Call to Action */}
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.whatsappBtn}
            >
              💬 Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
