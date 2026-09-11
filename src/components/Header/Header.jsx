import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const NAV_ITEMS = [
  { label: 'Inventario', to: '/inventario' },
  { label: 'Autovía Credit', to: '/', anchor: 'credit' },
  { label: 'Garantía', to: '/', anchor: 'garantia' },
  { label: 'Nosotros', to: '/', anchor: 'nosotros' },
  { label: 'Contacto', to: '/', anchor: 'contacto' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const irA = (to, anchorId) => {
    setIsOpen(false);

    if (to === '/' && anchorId && location.pathname === '/') {
      document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    navigate(to);
    if (to === '/' && anchorId) {
      setTimeout(() => {
        document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          to="/"
          className={styles.brand}
          onClick={(e) => { e.preventDefault(); irA('/'); }}
        >
          <span className={styles.logoMark}></span>
          <span className={styles.brandName}>
            Autovía <span className={styles.brandAccent}>Esmeralda</span>
          </span>
        </Link>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.anchor ? `#${item.anchor}` : item.to}
              className={`${styles.navLink} ${location.pathname === item.to && !item.anchor ? styles.active : ''}`}
              onClick={(e) => { e.preventDefault(); irA(item.to, item.anchor); }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="https://wa.me/5215554340686"
          target="_blank"
          rel="noreferrer"
          className={styles.whatsappBtn}
        >
          <span className={styles.dot}></span>
          WhatsApp
        </a>

        <button
          className={styles.menuBtn}
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={isOpen}
        >
          <span></span>
          <span></span>
        </button>
      </div>

      {isOpen && (
        <div className={styles.mobileMenu}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.anchor ? `#${item.anchor}` : item.to}
              className={styles.mobileNavLink}
              onClick={(e) => { e.preventDefault(); irA(item.to, item.anchor); }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="https://wa.me/5215554340686"
            target="_blank"
            rel="noreferrer"
            className={styles.mobileWhatsapp}
          >
            <span className={styles.dot}></span>
            WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
