import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Hero.module.css';
import bgImage from '../../assets/images/hero-entrega.webp';
import { useCatalogo } from '../../lib/catalogo';
import { marcasConConteo, tituloMarca } from '../../lib/cars';

const TODAS_MARCAS = 'Todas las marcas';
const TODOS_TIPOS = 'Todos los tipos';
const TIPO_OPTIONS = [TODOS_TIPOS, 'AUTOS', 'CAMIONETAS'];

export default function Hero() {
  const navigate = useNavigate();
  const { autos } = useCatalogo();
  const [marca, setMarca] = useState(TODAS_MARCAS);
  const [tipo, setTipo] = useState(TODOS_TIPOS);

  const marcaOptions = useMemo(
    () => [TODAS_MARCAS, ...marcasConConteo(autos).map((m) => m.marca)],
    [autos]
  );

  const partes = [];
  if (marca !== TODAS_MARCAS) partes.push(tituloMarca(marca));
  if (tipo !== TODOS_TIPOS) partes.push(tipo === 'AUTOS' ? 'Autos' : 'Camionetas');

  const resumen = partes.length
    ? `Buscando: ${partes.join(' · ')} — ${autos.length} unidades en inventario propio`
    : `Todo el inventario es propio: ${autos.length} unidades disponibles con Autovía Credit`;

  const verAutos = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (marca !== TODAS_MARCAS) params.set('marca', marca);
    if (tipo !== TODOS_TIPOS) params.set('tipo', tipo);
    const qs = params.toString();
    navigate(qs ? `/inventario?${qs}` : '/inventario');
  };

  return (
    <section id="top" className={styles.hero}>
      <div className={styles.grid}>
        <div>
          <div className={styles.badge}>Financiamiento propio y bancario</div>
          <h1 className={styles.title}>Tu próximo auto seminuevo, con garantía y financiamiento</h1>
          <p className={styles.lead}>
            Seminuevos certificados con revisión multipunto, hasta 1 año de garantía y crédito directo con{' '}
            <strong className={styles.leadStrong}>Autovía Credit</strong>. Enganche desde el 35%.
          </p>
          <div className={styles.stats}>
            <div>
              <div className={styles.statValue}>+{autos.length}</div>
              <div className={styles.statLabel}>unidades en piso</div>
            </div>
            <div className={styles.statDivider}></div>
            <div>
              <div className={styles.statValue}>48 <span className={styles.statUnit}>meses</span></div>
              <div className={styles.statLabel}>plazo máximo</div>
            </div>
            <div className={styles.statDivider}></div>
            <div>
              <div className={styles.statValue}>15 min</div>
              <div className={styles.statLabel}>respuesta de crédito</div>
            </div>
          </div>
        </div>

        <div className={styles.imgWrap}>
          <img src={bgImage} alt="Entrega de auto en Autovía Esmeralda" className={styles.img} />
        </div>
      </div>

      <div className={styles.searchBar}>
        <div>
          <label className={styles.searchLabel}>Marca</label>
          <select className={styles.searchInput} value={marca} onChange={(e) => setMarca(e.target.value)}>
            {marcaOptions.map((m) => (
              <option key={m} value={m}>{m === TODAS_MARCAS ? m : tituloMarca(m)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={styles.searchLabel}>Tipo</label>
          <select className={styles.searchInput} value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {TIPO_OPTIONS.map((t) => (
              <option key={t} value={t}>{t === TODOS_TIPOS ? t : t === 'AUTOS' ? 'Autos' : 'Camionetas'}</option>
            ))}
          </select>
        </div>
        <a href="/inventario" className={styles.searchBtn} onClick={verAutos}>Ver autos</a>
        <div className={styles.searchSummary}>{resumen}</div>
      </div>
    </section>
  );
}
