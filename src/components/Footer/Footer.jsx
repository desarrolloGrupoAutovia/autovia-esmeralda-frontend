import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';
import { useCatalogo } from '../../lib/catalogo';
import { marcasConConteo, tituloMarca } from '../../lib/cars';
import logoIcono from '../../assets/images/logo-icono.png';

export default function Footer() {
  const { autos } = useCatalogo();
  const marcas = marcasConConteo(autos);
  const location = useLocation();
  const navigate = useNavigate();

  /* Los anchors (#credit, #garantia...) solo existen dentro de Home: si ya
     estamos ahí, se hace scroll directo; si no, primero hay que navegar a
     "/" y recién entonces buscar el elemento, que todavía no existe en el
     DOM en el mismo tick. */
  const irAAnchor = (e, anchorId) => {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    navigate('/');
    setTimeout(() => document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <div className={styles.brand}>
              <img src={logoIcono} alt="" className={styles.logoMark} />
              <span className={styles.brandName}>Autovía Esmeralda</span>
            </div>
            <p className={styles.brandDesc}>
              Agencia de seminuevos certificados con financiamiento propio. Vendemos exclusivamente inventario propio.
            </p>
          </div>

          <div>
            <div className={styles.colLabel}>Navegación</div>
            <div className={styles.colLinks}>
              <Link to="/inventario">Inventario</Link>
              <a href="#credit" onClick={(e) => irAAnchor(e, 'credit')}>Autovía Credit</a>
              <a href="#garantia" onClick={(e) => irAAnchor(e, 'garantia')}>Garantía</a>
              <a href="#nosotros" onClick={(e) => irAAnchor(e, 'nosotros')}>Nosotros</a>
              <a href="#contacto" onClick={(e) => irAAnchor(e, 'contacto')}>Contacto</a>
            </div>
          </div>

          <div>
            <div className={styles.colLabel}>Legal</div>
            <div className={styles.colLinks}>
              <a href="#aviso-privacidad" onClick={(e) => irAAnchor(e, 'aviso-privacidad')}>Aviso de privacidad</a>
              <a href="#contacto" onClick={(e) => irAAnchor(e, 'contacto')}>Términos y condiciones</a>
              <a href="#contacto" onClick={(e) => irAAnchor(e, 'contacto')}>Condiciones de garantía</a>
            </div>
            <div className={`${styles.colLabel} ${styles.colLabelSpaced}`}>Redes</div>
            <div className={styles.socialRow}>
              <a href="https://instagram.com/grupoautovia" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://facebook.com/grupoautovia" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://wa.me/525554340686" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </div>

          {marcas.length > 0 && (
            <div>
              <div className={styles.colLabel}>Marcas disponibles</div>
              <div className={styles.marcasRow}>
                {marcas.map(({ marca }) => (
                  <Link
                    key={marca}
                    to={`/inventario?marca=${encodeURIComponent(marca)}`}
                    className={styles.marcaPill}
                  >
                    {tituloMarca(marca)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.disclaimer}>
            El financiamiento de Autovía Credit está sujeto a evaluación crediticia y aprobación. Las mensualidades
            mostradas son estimaciones informativas y no constituyen una oferta vinculante. Precios en pesos
            mexicanos, sujetos a cambio sin previo aviso. Disponibilidad limitada al inventario existente.
          </div>
          <div className={styles.copyright}>© {new Date().getFullYear()} Autovía Esmeralda</div>
        </div>
      </div>
    </footer>
  );
}
