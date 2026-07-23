import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.socialSection}>
          <h4 className={styles.socialTitle}>Contáctanos a través de nuestras redes sociales</h4>
          <div className={styles.socialLinks}>
            <a 
              href="https://facebook.com/grupoautovia" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.socialIcon} 
              aria-label="Facebook"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.88.39-1 1-1h2V2h-3c-2.9 0-5 1.55-5 4.5V8z"/>
              </svg>
            </a>
            <a 
              href="https://instagram.com/grupoautovia" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.socialIcon} 
              aria-label="Instagram"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
            <a 
              href="https://wa.me/525554340686?text=Hola,%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n." 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.socialIcon} 
              aria-label="WhatsApp"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.01 14.07 1.006 11.993 1.006c-5.437 0-9.863 4.37-9.867 9.8-.001 1.955.513 3.866 1.492 5.568l-1.002 3.657 3.765-.978c1.681.91 3.39 1.393 5.266 1.393zm11.233-7.551c-.305-.152-1.808-.888-2.088-.99-.281-.102-.485-.152-.689.152-.204.304-.79.99-.968 1.193-.178.203-.356.228-.661.076-.305-.152-1.288-.475-2.454-1.511-.908-.806-1.52-1.802-1.698-2.107-.178-.305-.019-.47.134-.62.137-.135.305-.355.457-.532.152-.177.203-.28.305-.457.102-.178.051-.33-.026-.482-.076-.152-.689-1.65-.944-2.26-.249-.594-.502-.514-.689-.524-.178-.009-.381-.011-.584-.011-.203 0-.533.076-.813.381-.281.305-1.067 1.041-1.067 2.54 0 1.499 1.092 2.946 1.244 3.149.152.203 2.15 3.264 5.207 4.582.727.314 1.294.502 1.737.643.73.232 1.395.199 1.92.121.584-.087 1.808-.737 2.062-1.448.254-.71.254-1.32.178-1.448-.076-.127-.28-.203-.584-.356z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <span>© {new Date().getFullYear()} Autovía Esmeralda. Todos los derechos reservados.</span>
          <a href="#aviso-privacidad" className={styles.privacyLink}>Aviso de Privacidad</a>
        </div>
      </div>
    </footer>
  );
}
