import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CreditSection.module.css';
import { useCotizador } from '../../lib/useCotizador';
import { mxn, ENGANCHE_MINIMO_PCT } from '../../lib/credito';

const PLAZOS = [12, 24, 36, 48];

const CREDIT_FACTS = [
  { value: `${ENGANCHE_MINIMO_PCT}%`, label: 'Enganche mínimo sobre el precio de contado' },
  { value: '48 meses', label: 'Plazo máximo, con mensualidad fija' },
  { value: '15 min', label: 'Respuesta de preautorización con tu INE' },
  { value: 'Tasa fija', label: 'Sin sorpresas: mismas reglas desde el día uno' },
];

export default function CreditSection() {
  const { price, setPrice, down, setDown, plazo, setPlazo, q } = useCotizador({});

  return (
    <section id="credit" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <div className={styles.badge}>Autovía Credit</div>
            <h2 className={styles.title}>Financiamiento directo con nosotros</h2>
            <p className={styles.lead}>
              Autovía Credit es el crédito interno de Autovía Esmeralda: nosotros somos la financiera, así que no
              dependemos de bancos ni de tu historial en buró. El proceso es muy sencillo: con tu INE en mano, en 15
              minutos te mandamos tu preautorización.
            </p>
            <div className={styles.factsGrid}>
              {CREDIT_FACTS.map((f) => (
                <div key={f.label} className={styles.factCard}>
                  <div className={styles.factValue}>{f.value}</div>
                  <div className={styles.factLabel}>{f.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.simulator}>
            <div className={styles.simTitle}>Simulador de pagos</div>
            <div className={styles.simNote}>Estimación informativa, sujeta a evaluación interna.</div>

            <div className={styles.field}>
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>Precio del auto</span>
                <span className={styles.fieldValue}>{mxn(price)}</span>
              </div>
              <input
                type="range" min={150000} max={750000} step={10000}
                value={price} onChange={(e) => setPrice(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.field}>
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>Enganche</span>
                <span className={styles.fieldValue}>{down}% · {mxn(q.enganche)}</span>
              </div>
              <input
                type="range" min={ENGANCHE_MINIMO_PCT} max={70} step={1}
                value={down} onChange={(e) => setDown(Number(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.fieldNote}>Enganche mínimo {ENGANCHE_MINIMO_PCT}% · plazos de 12 a 48 meses</div>
            </div>

            <div className={styles.field}>
              <div className={styles.plazoLabel}>Plazo</div>
              <div className={styles.plazoGrid}>
                {PLAZOS.map((p) => (
                  <button
                    key={p}
                    className={`${styles.plazoBtn} ${p === plazo ? styles.plazoBtnActive : ''}`}
                    onClick={() => setPlazo(p)}
                  >
                    {p}m
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.result}>
              <div className={styles.resultLabel}>Pago total mensual</div>
              <div className={styles.resultValue}>{mxn(q.total)}</div>
              <div className={styles.resultNote}>{plazo} pagos fijos · todo incluido</div>

              <div className={styles.breakdown}>
                <div className={styles.breakdownRow}>
                  <span className={styles.fieldLabel}>Enganche</span>
                  <span className={styles.breakdownValue}>{mxn(q.enganche)}</span>
                </div>
              </div>
            </div>

            <Link to="/inventario" className={styles.ctaBtn}>
              Ir al inventario
            </Link>
          </div>
        </div>

        <ComparativaRutas minDownLabel={`${ENGANCHE_MINIMO_PCT}%`} />
      </div>
    </section>
  );
}

function ComparativaRutas({ minDownLabel }) {
  return (
    <div className={styles.rutas}>
      <h3 className={styles.rutasTitle}>Dos rutas para financiar tu auto</h3>
      <p className={styles.rutasLead}>
        Elige la que se acomode a tu perfil. Te decimos cuál te conviene desde la primera llamada, sin darte vueltas.
      </p>

      <div className={styles.rutasGrid}>
        <div className={`${styles.rutaCard} ${styles.rutaCardActive}`}>
          <div className={styles.rutaHead}>
            <div className={styles.rutaTag}>Autovía Credit</div>
            <div className={styles.rutaPill}>Financiamiento propio</div>
          </div>
          <div className={styles.rutaName}>Nosotros somos la financiera</div>
          <p className={styles.rutaBody}>
            Aprobamos internamente, sin intermediarios. Es la ruta más rápida y la más flexible si tu historial
            crediticio es corto, irregular o simplemente no quieres pasar por un banco.
          </p>
          <div className={styles.rutaSpecs}>
            <div className={styles.rutaSpecRow}><span>Enganche mínimo</span><span className={styles.rutaSpecValue}>{minDownLabel}</span></div>
            <div className={styles.rutaSpecRow}><span>Plazo máximo</span><span className={styles.rutaSpecValue}>48 meses</span></div>
            <div className={styles.rutaSpecRow}><span>Respuesta</span><span className={styles.rutaSpecValue}>15 minutos</span></div>
            <div className={`${styles.rutaSpecRow} ${styles.rutaSpecRowLast}`}><span>Antigüedad</span><span className={styles.rutaSpecValue}>Sin restricción</span></div>
          </div>
        </div>

        <div className={styles.rutaCard}>
          <div className={styles.rutaHead}>
            <div className={styles.rutaTagMuted}>Financiamiento bancario</div>
            <div className={styles.rutaPillMuted}>Convenio</div>
          </div>
          <div className={styles.rutaName}>Crédito con bancos aliados</div>
          <p className={styles.rutaBody}>
            Tenemos convenio con instituciones bancarias, así que puedes financiar la misma unidad directamente con
            ellas: enganche más bajo y plazos más largos. Requiere{' '}
            <strong className={styles.rutaStrong}>excelente historial en buró de crédito</strong> para aplicar y que
            la unidad tenga máximo 8 años de antigüedad; el banco es quien autoriza.
          </p>
          <div className={styles.rutaSpecs}>
            <div className={styles.rutaSpecRow}><span>Enganche mínimo</span><span className={styles.rutaSpecValue}>20%</span></div>
            <div className={styles.rutaSpecRow}><span>Plazo máximo</span><span className={styles.rutaSpecValue}>60 meses</span></div>
            <div className={styles.rutaSpecRow}><span>Antigüedad máxima</span><span className={styles.rutaSpecValue}>8 años</span></div>
            <div className={`${styles.rutaSpecRow} ${styles.rutaSpecRowLast}`}><span>Historial en buró</span><span className={styles.rutaSpecValueBright}>Excelente, obligatorio</span></div>
          </div>
        </div>
      </div>

      <div className={styles.rutasFoot}>
        Ambas rutas aplican sobre el mismo inventario propio. La aprobación del financiamiento bancario depende
        exclusivamente de la institución financiera y de tu historial crediticio; Autovía Esmeralda únicamente
        gestiona el trámite del convenio.
      </div>
    </div>
  );
}
