import React, { useState } from 'react';
import styles from './Inventory.module.css';
import carsDetailed from '../../assets/cars_detailed.json';

// Eager load all webp images recursively under assets/images/cars/
const carImageModules = import.meta.glob('../../assets/images/cars/**/*.webp', { eager: true });

export default function Inventory({ onSelectCar }) {
  const [selectedCategories, setSelectedCategories] = useState(['CAMIONETAS', 'AUTOS']);
  const [sortBy, setSortBy] = useState('relevancia');

  const getCarImageUrl = (imagePath) => {
    const path = `../../assets/images/cars/${imagePath}`;
    return carImageModules[path] ? carImageModules[path].default : '';
  };

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== category));
      }
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const parsePrice = (priceStr) => {
    return parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));
  };

  // Filter cars (exclude generic entries like "Grupo Autovía")
  const filteredCars = carsDetailed.filter(car => {
    const isRealCar = !car.slug.includes('grupo-autovia');
    return isRealCar && selectedCategories.includes(car.category);
  });

  // Sort cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortBy === 'bajo-alto') {
      return parsePrice(a.price) - parsePrice(b.price);
    }
    if (sortBy === 'alto-bajo') {
      return parsePrice(b.price) - parsePrice(a.price);
    }
    return 0;
  });

  return (
    <section className={styles.inventorySection}>
      <div className={styles.container}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Bienvenido a nuestro inventario</h1>
          <p className={styles.subtitle}>
            Contamos con distintos modelos de distintas marcas para que escojas el que más te guste.
          </p>
        </div>

        <div className={styles.layout}>
          {/* Sidebar Filter Panel */}
          <aside className={styles.sidebar}>
            <h3 className={styles.filterTitle}>Filtrar por</h3>
            
            <div className={styles.filterGroup}>
              <h4 className={styles.groupLabel}>Tipo de vehículo</h4>
              
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes('CAMIONETAS')} 
                  onChange={() => handleCategoryChange('CAMIONETAS')}
                />
                CAMIONETAS
              </label>

              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes('AUTOS')} 
                  onChange={() => handleCategoryChange('AUTOS')}
                />
                AUTOS
              </label>
            </div>
          </aside>

          {/* Catalog Grid */}
          <main>
            <div className={styles.catalogHeader}>
              <select className={styles.sortSelect} value={sortBy} onChange={handleSortChange}>
                <option value="relevancia">Ordenar por: Relevancia</option>
                <option value="bajo-alto">Precio: Bajo a Alto</option>
                <option value="alto-bajo">Precio: Alto a Bajo</option>
              </select>
            </div>

            <div className={styles.grid}>
              {sortedCars.length > 0 ? (
                sortedCars.map((car, index) => (
                  <div 
                    key={index} 
                    className={styles.card} 
                    onClick={() => onSelectCar(car.slug)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.imgWrapper}>
                      <img 
                        src={getCarImageUrl(car.images[0]) || `https://via.placeholder.com/400x300?text=${encodeURIComponent(car.name)}`} 
                        alt={car.name} 
                        className={styles.cardImg} 
                      />
                    </div>
                    <div className={styles.cardContent}>
                      <span className={styles.categoryTag}>{car.category}</span>
                      <h3 className={styles.carName}>{car.name}</h3>
                      <span className={styles.carPrice}>{car.price}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>
                  No se encontraron vehículos en esta categoría.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
