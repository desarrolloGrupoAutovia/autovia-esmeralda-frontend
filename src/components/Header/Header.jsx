import React, { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={styles.title}>Autovía Esmeralda</span>
          <span className={styles.subtitle}>Excelencia sobre ruedas</span>
        </div>

        <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Toggle menu">
          <span style={{ transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
          <span style={{ opacity: isOpen ? 0 : 1 }}></span>
          <span style={{ transform: isOpen ? 'rotate(-45deg) translate(6px, -7px)' : 'none' }}></span>
        </button>

        <nav className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
          <ul className={styles.menuList}>
            <li className={styles.menuItem} onClick={() => setIsOpen(false)}>
              <a href="#principal">Página principal</a>
            </li>
            <li className={styles.menuItem} onClick={() => setIsOpen(false)}>
              <a href="#mision-vision">Misión & Visión</a>
            </li>
            <li className={styles.menuItem} onClick={() => setIsOpen(false)}>
              <a href="#sucursal">Sucursal</a>
            </li>
          </ul>
          <div className={styles.contactInfo}>
            <span className={styles.phoneIcon}>📞</span>
            <a href="tel:5554340686">55 5434 0686</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
