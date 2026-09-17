import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LegalPage.module.css';

/* children ya viene armado como JSX (secciones h2/p/ul) desde cada página
   legal concreta — este componente solo pone el marco visual común. */
export default function LegalPage({ title, subtitle, updated, children }) {
  return (
    <section className={styles.section}>
      <div className={styles.page}>
        <div className={styles.breadcrumb}>
          <Link to="/">Inicio</Link> / {title}
        </div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        <div className={styles.body}>{children}</div>
        {updated && <div className={styles.updated}>Fecha de actualización: {updated}</div>}
      </div>
    </section>
  );
}
