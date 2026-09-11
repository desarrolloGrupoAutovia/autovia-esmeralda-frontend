import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './Inventory.module.css';
import CarCard from '../CarCard/CarCard';
import { parsePrice, parseMarca, marcasConConteo, tituloMarca } from '../../lib/cars';
import { mensualidadEstimada, mxn } from '../../lib/credito';
import { useCatalogo } from '../../lib/catalogo';

const TIPOS = [
  { value: 'todos', label: 'Todos' },
  { value: 'AUTOS', label: 'Autos' },
  { value: 'CAMIONETAS', label: 'Camionetas' },
];

const ORDEN_OPTIONS = [
  { value: 'relevancia', label: 'Ordenar por: Relevancia' },
  { value: 'bajo-alto', label: 'Precio: Bajo a Alto' },
  { value: 'alto-bajo', label: 'Precio: Alto a Bajo' },
];

const PRECIO_MIN = 200000;
const PRECIO_MAX = 700000;
export const MENSUALIDAD_MIN = 6000;
export const MENSUALIDAD_MAX = 16000;
const TODAS_MARCAS = 'Todas las marcas';

/* Los filtros viven en la URL (?tipo=&marca=&maxPrecio=&maxMensualidad=&orden=)
   en vez de useState local: así son compartibles, sobreviven a un F5, y
   atrás/adelante del navegador los restaura solos — nada de esto pasaba
   cuando el "routing" era un switch de estado en memoria. */
export default function Inventory() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tipo = searchParams.get('tipo') || 'todos';
  const marca = searchParams.get('marca') || TODAS_MARCAS;
  const maxPrecio = Number(searchParams.get('maxPrecio')) || PRECIO_MAX;
  const maxMensualidad = Number(searchParams.get('maxMensualidad')) || MENSUALIDAD_MAX;
  const orden = searchParams.get('orden') || 'relevancia';

  const actualizarFiltro = (clave, valor, valorPorDefecto) => {
    const next = new URLSearchParams(searchParams);
    if (valor === valorPorDefecto) next.delete(clave);
    else next.set(clave, valor);
    setSearchParams(next, { replace: false });
  };

  const { autos, cargando, error } = useCatalogo();

  const marcaOptions = useMemo(
    () => [TODAS_MARCAS, ...marcasConConteo(autos).map((m) => m.marca)],
    [autos]
  );

  const filtrados = useMemo(() => {
    let lista = autos.filter((car) => {
      if (tipo !== 'todos' && car.category !== tipo) return false;
      if (marca !== TODAS_MARCAS && parseMarca(car.name) !== marca) return false;
      if (parsePrice(car.price) > maxPrecio) return false;
      if (mensualidadEstimada(parsePrice(car.price)) > maxMensualidad) return false;
      return true;
    });

    if (orden === 'bajo-alto') lista = [...lista].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (orden === 'alto-bajo') lista = [...lista].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

    return lista;
  }, [autos, tipo, marca, maxPrecio, maxMensualidad, orden]);

  const filtrosActivos = [];
  if (tipo !== 'todos') filtrosActivos.push(TIPOS.find((t) => t.value === tipo)?.label);
  if (marca !== TODAS_MARCAS) filtrosActivos.push(tituloMarca(marca));
  if (maxPrecio < PRECIO_MAX) filtrosActivos.push(`Hasta ${mxn(maxPrecio)}`);
  if (maxMensualidad < MENSUALIDAD_MAX) filtrosActivos.push(`Hasta ${mxn(maxMensualidad)}/mes`);

  const limpiarFiltros = () => setSearchParams({});

  if (cargando) {
    return (
      <section className={styles.section}>
        <div className={styles.headWrap}>
          <p className={styles.subtitle}>Cargando inventario…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.headWrap}>
          <p className={styles.subtitle}>No se pudo cargar el inventario. Intenta recargar la página.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.headWrap}>
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.breadcrumbLink}>Inicio</Link> / Inventario
        </div>
        <div className={styles.headRow}>
          <div>
            <h1 className={styles.title}>Inventario propio</h1>
            <p className={styles.subtitle}>{filtrados.length} unidades certificadas, todas financiables con Autovía Credit.</p>
          </div>
          <div className={styles.ordenWrap}>
            <span className={styles.ordenLabel}>Ordenar</span>
            <select
              className={styles.ordenSelect} value={orden}
              onChange={(e) => actualizarFiltro('orden', e.target.value, 'relevancia')}
            >
              {ORDEN_OPTIONS.map((op) => <option key={op.value} value={op.value}>{op.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHead}>
            <div className={styles.sidebarTitle}>Filtros</div>
            <button className={styles.clearBtn} onClick={limpiarFiltros}>Limpiar</button>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Tipo</div>
            <div className={styles.chips}>
              {TIPOS.map((t) => (
                <button
                  key={t.value}
                  className={`${styles.chip} ${tipo === t.value ? styles.chipActive : ''}`}
                  onClick={() => actualizarFiltro('tipo', t.value, 'todos')}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Marca</div>
            <select
              className={styles.select} value={marca}
              onChange={(e) => actualizarFiltro('marca', e.target.value, TODAS_MARCAS)}
            >
              {marcaOptions.map((m) => (
                <option key={m} value={m}>{m === TODAS_MARCAS ? m : tituloMarca(m)}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.sliderRow}>
              <span className={styles.filterLabel}>Precio máx.</span>
              <span className={styles.sliderValue}>{mxn(maxPrecio)}</span>
            </div>
            <input
              type="range" min={PRECIO_MIN} max={PRECIO_MAX} step={10000}
              value={maxPrecio}
              onChange={(e) => actualizarFiltro('maxPrecio', e.target.value, String(PRECIO_MAX))}
              className={styles.slider}
            />
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.sliderRow}>
              <span className={styles.filterLabel}>Mensualidad máx.</span>
              <span className={styles.sliderValue}>{mxn(maxMensualidad)}</span>
            </div>
            <input
              type="range" min={MENSUALIDAD_MIN} max={MENSUALIDAD_MAX} step={500}
              value={maxMensualidad}
              onChange={(e) => actualizarFiltro('maxMensualidad', e.target.value, String(MENSUALIDAD_MAX))}
              className={styles.slider}
            />
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoTitle}>Mensualidades estimadas</div>
            <div className={styles.infoText}>
              Pago total mensual con enganche del 35% a 48 meses, todo incluido. Sujeto a evaluación interna.
            </div>
          </div>
        </aside>

        <main>
          {filtrosActivos.length > 0 && (
            <div className={styles.activeFilters}>
              <span className={styles.resultCount}>{filtrados.length} resultados</span>
              {filtrosActivos.map((f) => (
                <span key={f} className={styles.filterPill}>{f}</span>
              ))}
            </div>
          )}

          {filtrados.length > 0 ? (
            <div className={styles.grid}>
              {filtrados.map((car) => (
                <CarCard key={car.slug} car={car} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <div className={styles.emptyTitle}>Ninguna unidad coincide con esos filtros</div>
              <div className={styles.emptyText}>Ajusta el presupuesto o escríbenos: recibimos unidades nuevas cada semana.</div>
              <button className={styles.emptyBtn} onClick={limpiarFiltros}>Limpiar filtros</button>
            </div>
          )}

          <div className={styles.ctaBanner}>
            <div>
              <div className={styles.ctaTitle}>¿No encuentras el modelo que buscas?</div>
              <div className={styles.ctaText}>Dinos qué buscas y te avisamos cuando entre a piso, ya con su mensualidad calculada.</div>
            </div>
            <a
              href="https://wa.me/525554340686?text=Hola,%20estoy%20buscando%20un%20auto%20en%20especial."
              target="_blank" rel="noopener noreferrer"
              className={styles.ctaBtn}
            >
              Escribir por WhatsApp
            </a>
          </div>
        </main>
      </div>
    </section>
  );
}
