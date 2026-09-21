import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './Inventory.module.css';
import CarCard from '../CarCard/CarCard';
import { parsePrice, parseMarca, marcasConConteo, tituloMarca } from '../../lib/cars';
import { mensualidadEstimada, mxn } from '../../lib/credito';
import { useCatalogo } from '../../lib/catalogo';

const ORDEN_OPTIONS = [
  { value: 'relevancia', label: 'Ordenar por: Relevancia' },
  { value: 'bajo-alto', label: 'Precio: Bajo a Alto' },
  { value: 'alto-bajo', label: 'Precio: Alto a Bajo' },
];

/* Los topes de los sliders salen del inventario real, no de constantes
   fijas: estaban clavados en $700.000 y $16.000/mes, y cuando entraron
   unidades más caras (un Corvette de $1.999.900, un i8 de $1.799.900, una
   Sprinter de $17.300/mes) el propio filtro las escondía del catálogo
   aunque estuvieran publicadas y disponibles. */
const PASO_PRECIO = 10000;
const PASO_MENSUALIDAD = 500;

/* Se redondea hacia arriba al paso del slider para que el auto más caro
   quede dentro del rango y no justo por afuera del tope. */
const redondearArriba = (n, paso) => Math.ceil(n / paso) * paso;
const redondearAbajo = (n, paso) => Math.floor(n / paso) * paso;

const TODAS_MARCAS = 'Todas las marcas';

/* Los filtros viven en la URL (?carroceria=&marca=&maxPrecio=&maxMensualidad=&orden=)
   en vez de useState local: así son compartibles, sobreviven a un F5, y
   atrás/adelante del navegador los restaura solos — nada de esto pasaba
   cuando el "routing" era un switch de estado en memoria. */
const TODAS_CARROCERIAS = 'todas';
const CARROCERIA_LABEL = { [TODAS_CARROCERIAS]: 'Todos' };

export default function Inventory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { autos, cargando, error } = useCatalogo();

  const { precioMin, precioMax, mensualidadMin, mensualidadMax } = useMemo(() => {
    const precios = autos.map((c) => parsePrice(c.price)).filter((p) => p > 0);
    if (!precios.length) return { precioMin: 0, precioMax: 0, mensualidadMin: 0, mensualidadMax: 0 };
    const mensualidades = precios.map(mensualidadEstimada);
    return {
      precioMin: redondearAbajo(Math.min(...precios), PASO_PRECIO),
      precioMax: redondearArriba(Math.max(...precios), PASO_PRECIO),
      mensualidadMin: redondearAbajo(Math.min(...mensualidades), PASO_MENSUALIDAD),
      mensualidadMax: redondearArriba(Math.max(...mensualidades), PASO_MENSUALIDAD),
    };
  }, [autos]);

  const carroceria = searchParams.get('carroceria') || TODAS_CARROCERIAS;
  const marca = searchParams.get('marca') || TODAS_MARCAS;
  const maxPrecio = Number(searchParams.get('maxPrecio')) || precioMax;
  const maxMensualidad = Number(searchParams.get('maxMensualidad')) || mensualidadMax;
  const orden = searchParams.get('orden') || 'relevancia';

  const actualizarFiltro = (clave, valor, valorPorDefecto) => {
    const next = new URLSearchParams(searchParams);
    if (valor === valorPorDefecto) next.delete(clave);
    else next.set(clave, valor);
    setSearchParams(next, { replace: false });
  };

  const marcaOptions = useMemo(
    () => [TODAS_MARCAS, ...marcasConConteo(autos).map((m) => m.marca)],
    [autos]
  );

  const carroceriaOptions = useMemo(
    () => [TODAS_CARROCERIAS, ...new Set(autos.map((c) => c.carroceria).filter(Boolean))],
    [autos]
  );

  const filtrados = useMemo(() => {
    let lista = autos.filter((car) => {
      if (carroceria !== TODAS_CARROCERIAS && car.carroceria !== carroceria) return false;
      if (marca !== TODAS_MARCAS && parseMarca(car.name) !== marca) return false;
      if (parsePrice(car.price) > maxPrecio) return false;
      if (mensualidadEstimada(parsePrice(car.price)) > maxMensualidad) return false;
      return true;
    });

    if (orden === 'bajo-alto') lista = [...lista].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (orden === 'alto-bajo') lista = [...lista].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

    return lista;
  }, [autos, carroceria, marca, maxPrecio, maxMensualidad, orden]);

  const filtrosActivos = [];
  if (carroceria !== TODAS_CARROCERIAS) filtrosActivos.push(carroceria);
  if (marca !== TODAS_MARCAS) filtrosActivos.push(tituloMarca(marca));
  if (maxPrecio < precioMax) filtrosActivos.push(`Hasta ${mxn(maxPrecio)}`);
  if (maxMensualidad < mensualidadMax) filtrosActivos.push(`Hasta ${mxn(maxMensualidad)}/mes`);

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
            <div className={styles.filterLabel}>Carrocería</div>
            <div className={styles.chips}>
              {carroceriaOptions.map((c) => (
                <button
                  key={c}
                  className={`${styles.chip} ${carroceria === c ? styles.chipActive : ''}`}
                  onClick={() => actualizarFiltro('carroceria', c, TODAS_CARROCERIAS)}
                >
                  {CARROCERIA_LABEL[c] || c}
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
              type="range" min={precioMin} max={precioMax} step={PASO_PRECIO}
              value={maxPrecio}
              onChange={(e) => actualizarFiltro('maxPrecio', e.target.value, String(precioMax))}
              className={styles.slider}
            />
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.sliderRow}>
              <span className={styles.filterLabel}>Mensualidad máx.</span>
              <span className={styles.sliderValue}>{mxn(maxMensualidad)}</span>
            </div>
            <input
              type="range" min={mensualidadMin} max={mensualidadMax} step={PASO_MENSUALIDAD}
              value={maxMensualidad}
              onChange={(e) => actualizarFiltro('maxMensualidad', e.target.value, String(mensualidadMax))}
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
