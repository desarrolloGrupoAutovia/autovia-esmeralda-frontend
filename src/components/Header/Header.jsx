import React, { useState } from 'react';
import styles from './Header.module.css';
import logoImg from '../../assets/images/2c5d2d17-9dad-4a8a-af30-4cacd335c11c.webp';

export default function Header({ currentView, onViewChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavClick = (view, anchorId) => {
    onViewChange(view);
    setIsOpen(false);
    
    // If we switch to 'inicio' and want to scroll to an anchor
    if (view === 'inicio' && anchorId) {
      setTimeout(() => {
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={styles.header}>
      {/* Top Bar with Logo and Info */}
      <div className={styles.topBar}>
        <div className={styles.topContainer}>
          <div className={styles.brand} onClick={() => handleNavClick('inicio')} style={{ cursor: 'pointer' }}>
            <img src={logoImg} alt="Autovía Esmeralda Logo" className={styles.logoImage} />
            <div className={styles.brandText}>
              <span className={styles.title}>AUTOVÍA ESMERALDA</span>
              <span className={styles.subtitle}>"Excelencia sobre ruedas"</span>
            </div>
          </div>

          <div className={styles.contactInfo}>
            <div className={styles.infoItem}>
              <span className={styles.icon}>📍</span>
              <span>Autovía Esmeralda...</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.icon}>📞</span>
              <a href="tel:5554340686">55 5434 0686</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Teal Navigation Bar */}
      <div className={styles.navBar}>
        <div className={styles.navContainer}>
          <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Toggle menu">
            <span style={{ transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
            <span style={{ opacity: isOpen ? 0 : 1 }}></span>
            <span style={{ transform: isOpen ? 'rotate(-45deg) translate(6px, -7px)' : 'none' }}></span>
          </button>

          <nav className={`${styles.navList} ${isOpen ? styles.open : ''}`}>
            <li className={`${styles.navItem} ${currentView === 'inicio' ? styles.active : ''}`}>
              <a href="#principal" onClick={(e) => { e.preventDefault(); handleNavClick('inicio'); }}>
                Página principal
              </a>
            </li>

            <li className={`${styles.navItem} ${currentView === 'tienda' ? styles.active : ''}`}>
              <a href="#comprar" onClick={(e) => { e.preventDefault(); handleNavClick('tienda'); }}>
                Comprar un auto
              </a>
            </li>

            <li className={styles.navItem}>
              <span className={styles.dropdownToggle}>Autovía Esmeralda ▾</span>
              <ul className={styles.dropdown}>
                <li className={styles.dropdownItem}>
                  <a href="#mision-vision" onClick={(e) => { e.preventDefault(); handleNavClick('inicio', 'mision-vision'); }}>
                    Misión
                  </a>
                </li>
                <li className={styles.dropdownItem}>
                  <a href="#mision-vision" onClick={(e) => { e.preventDefault(); handleNavClick('inicio', 'mision-vision'); }}>
                    Visión
                  </a>
                </li>
                <li className={styles.dropdownItem}>
                  <a href="#mision-vision" onClick={(e) => { e.preventDefault(); handleNavClick('inicio', 'mision-vision'); }}>
                    Clientes Satisfechos
                  </a>
                </li>
                <li className={styles.dropdownItem}>
                  <a href="#sucursal" onClick={(e) => { e.preventDefault(); handleNavClick('inicio', 'sucursal'); }}>
                    Sucursal
                  </a>
                </li>
              </ul>
            </li>
          </nav>
        </div>
      </div>
    </header>
  );
}
