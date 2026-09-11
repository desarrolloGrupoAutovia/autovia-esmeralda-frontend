import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './CarDetail.module.css';
import CarCard from '../CarCard/CarCard';
import { getCarImageUrl, parsePrice, parseAnio, parseKm } from '../../lib/cars';
import { mxn, ENGANCHE_MINIMO_PCT } from '../../lib/credito';
import { useCotizador } from '../../lib/useCotizador';
import { useCatalogo } from '../../lib/catalogo';

const PLAZOS = [12, 24, 36, 48];

const PUNTOS_REVISION = [
  { name: 'Motor', status: 'OK' },
  { name: 'Frenos', status: 'OK' },
  { name: 'Suspensión', status: 'OK' },
  { name: 'Transmisión', status: 'OK' },
  { name: 'Eléctrico', status: 'OK' },
  { name: 'Carrocería', status: 'OK' },
  { name: 'Interiores', status: 'OK' },
  { name: 'Documentos', status: 'OK' },
];

function garantiaDe(anio) {
  if (anio && anio >= 2018) {
    return { nivel: 'Certificación completa', plazo: '1 año', limite: 'o 10,000 km' };
  }
  return { nivel: 'Certificación básica', plazo: '3 meses', limite: 'o 2,000 km' };
}

export default function CarDetail() {
  const { slug: carSlug } = useParams();
  const { autos, cargando: catalogoCargando, error: catalogoError } = useCatalogo();
  const [car, setCar] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [formData, setFormData] = useState({
    nombres: '', apellidos: '', fechaNacimiento: '', rfc: '', genero: '',
    estadoCivil: '', dependientes: '0', nivelEstudios: '', vehiculoPropio: '',
    calle: '', noExterior: '', noInterior: '', codigoPostal: '', colonia: '',
    municipio: '', estado: '', tipoVivienda: '', anosDomicilio: '0',
    celular: '', telefonoFijo: '', correo: '', autorizacion: false,
  });

  const parsedPrice = car ? parsePrice(car.price) : 0;
  const { setPrice, down, setDown, plazo, setPlazo, q } = useCotizador({
    precioInicial: parsedPrice || 419900,
  });

  useEffect(() => {
    const foundCar = autos.find((c) => c.slug === carSlug);
    if (foundCar) {
      setCar(foundCar);
      setActiveImageIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [carSlug, autos]);

  useEffect(() => {
    if (car) setPrice(parsePrice(car.price));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car]);

  if (!car) {
    return (
      <section className={styles.detailSection}>
        <div className={styles.container}>
          <Link to="/inventario" className={styles.backBtn}>← Volver al inventario</Link>
          <div>
            {catalogoError
              ? 'No se pudo cargar la información del vehículo. Intenta recargar la página.'
              : catalogoCargando
                ? 'Cargando datos del vehículo...'
                : 'No encontramos ese auto en el inventario.'}
          </div>
        </div>
      </section>
    );
  }

  const anio = parseAnio(car.name);
  const km = parseKm(car.km);
  const garantia = garantiaDe(anio);

  const handleInputChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const handleNextStep = () => setFormStep((prev) => Math.min(prev + 1, 3));
  const handlePrevStep = () => setFormStep((prev) => Math.max(prev - 1, 1));

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? car.images.length - 1 : prev - 1));
  };
  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === car.images.length - 1 ? 0 : prev + 1));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.autorizacion) return;

    const message = `*SOLICITUD DE FINANCIAMIENTO*\n` +
      `Estás solicitando para: *${car.name}*\n` +
      `• Pago mensual: ${mxn(q.total)}/mes\n` +
      `• Enganche: ${down}% (${mxn(q.enganche)})\n` +
      `• Plazo: ${plazo} meses\n\n` +
      `*Datos Personales:*\n` +
      `• Nombre: ${formData.nombres} ${formData.apellidos}\n` +
      `• RFC: ${formData.rfc}\n` +
      `• Celular: ${formData.celular}\n` +
      `• Correo: ${formData.correo}\n` +
      `• Domicilio: ${formData.calle}, Ext: ${formData.noExterior}, CP: ${formData.codigoPostal}, ${formData.colonia}, ${formData.municipio}, ${formData.estado}`;

    window.open(`https://wa.me/525554340686?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setIsModalOpen(false);
    setFormStep(1);
  };

  const defaultWhatsappUrl = `https://wa.me/525554340686?text=${encodeURIComponent(
    `Hola, estoy interesado en el vehículo ${car.name} (${car.price}) que vi en su sitio web de Autovía Esmeralda.`
  )}`;

  const currentCarImage = car.images?.length ? getCarImageUrl(car.images[activeImageIndex]) : '';

  const similares = autos
    .filter((c) => c.slug !== car.slug && c.category === car.category)
    .slice(0, 3);

  const specEntries = [
    ['Kilometraje', car.km ? `${car.km} km` : null],
    ['Motor', car.motor],
    ['Potencia', car.potencia],
    ['Transmisión', car.transmision],
    ['Combustible', car.combustible],
    ['Capacidad', car.capacidad],
    ['Tracción', car.traccion],
  ].filter(([, v]) => v);

  /* /api/catalogo manda equipamiento como array (columna jsonb de
     vehiculos); nunca llega como string separado por comas. */
  const equipoItems = (Array.isArray(car.equipamiento) ? car.equipamiento : [])
    .map((s) => String(s).trim())
    .filter(Boolean)
    .slice(0, 10);

  return (
    <section className={styles.detailSection}>
      <div className={styles.breadcrumbWrap}>
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.breadcrumbLink}>Inicio</Link> /{' '}
          <Link to="/inventario" className={styles.breadcrumbLink}>Inventario</Link> / {car.name}
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.layout}>
          <div>
            {/* ---------- galería ---------- */}
            <div
              className={styles.mainImageWrapper}
              onClick={() => currentCarImage && setIsLightboxOpen(true)}
              title={currentCarImage ? 'Haz clic para ampliar' : undefined}
            >
              {currentCarImage ? (
                <img src={currentCarImage} alt={car.name} className={styles.mainImage} />
              ) : (
                <div className={styles.mainImagePlaceholder}></div>
              )}
              <span className={styles.badgeEntrega}>Entrega inmediata</span>
              {car.images?.length > 0 && (
                <span className={styles.photoCounter}>{activeImageIndex + 1} / {car.images.length}</span>
              )}
            </div>

            {car.images.length > 1 && (
              <div className={styles.thumbnails}>
                {car.images.map((imagePath, index) => {
                  const thumbUrl = getCarImageUrl(imagePath);
                  return (
                    <button
                      key={index}
                      className={`${styles.thumbBtn} ${index === activeImageIndex ? styles.thumbActive : ''}`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      {thumbUrl && <img src={thumbUrl} alt={`${car.name} - Vista ${index + 1}`} className={styles.thumbImage} />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ---------- ficha técnica ---------- */}
            {specEntries.length > 0 && (
              <div className={styles.block}>
                <h2 className={styles.blockTitle}>Ficha técnica</h2>
                <div className={styles.specsGrid}>
                  {specEntries.map(([k, v]) => (
                    <div key={k} className={styles.specCell}>
                      <div className={styles.specKey}>{k}</div>
                      <div className={styles.specValue}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---------- equipamiento ---------- */}
            {equipoItems.length > 0 && (
              <div className={styles.block}>
                <h2 className={styles.blockTitle}>Equipamiento</h2>
                <div className={styles.equipoGrid}>
                  {equipoItems.map((item) => (
                    <div key={item} className={styles.equipoRow}>
                      <span className={styles.equipoDot}></span>{item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---------- garantía ---------- */}
            <div className={styles.warrantyCard}>
              <div className={styles.warrantyHead}>
                <div>
                  <h2 className={styles.blockTitle}>{garantia.nivel}</h2>
                  <p className={styles.warrantyText}>
                    Esta unidad pasó la revisión multipunto de nuestro taller y sale con {garantia.plazo} {garantia.limite} de
                    garantía. El certificado se entrega impreso con la factura.
                  </p>
                </div>
                <div className={styles.warrantyBadge}>
                  <div className={styles.warrantyBadgeLabel}>Garantía</div>
                  <div className={styles.warrantyBadgeValue}>{garantia.plazo}</div>
                  <div className={styles.warrantyBadgeSub}>{garantia.limite}</div>
                </div>
              </div>
              <div className={styles.revisionGrid}>
                {PUNTOS_REVISION.map((rv) => (
                  <div key={rv.name} className={styles.revisionRow}>
                    <span>{rv.name}</span>
                    <span className={styles.revisionStatus}>{rv.status}</span>
                  </div>
                ))}
              </div>
              <div className={styles.warrantyFoot}>Sin reporte de robo (REPUVE) · Sin adeudos de tenencia.</div>
            </div>
          </div>

          {/* ---------- sidebar ---------- */}
          <aside className={styles.sidebar}>
            <div className={styles.priceCard}>
              <div className={styles.metaLine}>
                {[anio, km != null ? `${km.toLocaleString('es-MX')} km` : null, car.category].filter(Boolean).join(' · ')}
              </div>
              <h1 className={styles.carName}>{car.name}</h1>
              <div className={styles.metaSub}>
                {[car.transmision, car.combustible].filter(Boolean).join(' · ')}
              </div>

              <div className={styles.priceBlock}>
                <div className={styles.priceLabel}>Precio de contado</div>
                <div className={styles.priceValue}>{mxn(parsedPrice)}</div>
              </div>

              <div className={styles.simBox}>
                <div className={styles.simHead}>
                  <div className={styles.simHeadLabel}>Pago total mensual</div>
                  <div className={styles.simHeadNote}>{plazo} pagos</div>
                </div>
                <div className={styles.simMonthly}>{mxn(q.total)}<span className={styles.simMonthlyUnit}>/mes</span></div>
                <div className={styles.simMonthlyNote}>Enganche {down}% · {mxn(q.enganche)}</div>

                <div className={styles.simRows}>
                  <div className={styles.simRow}><span>Enganche {down}%</span><span className={styles.simRowValue}>{mxn(q.enganche)}</span></div>
                  <div className={styles.simRow}><span>Monto a financiar</span><span className={styles.simRowValue}>{mxn(q.financiado)}</span></div>
                </div>

                <div className={styles.simInicial}>
                  <div className={styles.simInicialRow}>
                    <span>Pago inicial</span>
                    <span className={styles.simInicialValue}>{mxn(q.inicial)}</span>
                  </div>
                  <div className={styles.simInicialNote}>Incluye enganche y gastos iniciales del crédito.</div>
                </div>

                <div className={styles.field}>
                  <div className={styles.fieldRow}>
                    <span>Enganche</span>
                    <span className={styles.fieldValue}>{down}%</span>
                  </div>
                  <input
                    type="range" min={ENGANCHE_MINIMO_PCT} max={70} step={1}
                    value={down} onChange={(e) => setDown(Number(e.target.value))}
                    className={styles.slider}
                  />
                </div>

                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Plazo</div>
                  <div className={styles.plazoGrid}>
                    {PLAZOS.map((p) => (
                      <button
                        key={p}
                        className={`${styles.plazoBtn} ${p === plazo ? styles.plazoBtnActive : ''}`}
                        onClick={() => setPlazo(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setIsModalOpen(true); setFormStep(1); }}
                className={styles.ctaSolid}
              >
                Solicita tu crédito
              </button>
              <a href={defaultWhatsappUrl} target="_blank" rel="noreferrer" className={styles.ctaOutline}>
                Agendar prueba de manejo
              </a>

              <div className={styles.bankNote}>
                <div className={styles.bankNoteLabel}>También con financiamiento bancario</div>
                <div className={styles.bankNoteText}>
                  Esta unidad también se puede financiar con nuestros bancos en convenio: desde 20% de enganche y hasta
                  60 meses. Aplica solo con excelente historial en buró de crédito.
                </div>
              </div>
              <div className={styles.disclaimer}>Cotización estimada, sujeta a evaluación crediticia.</div>
            </div>

            <div className={styles.showroomCard}>
              <div className={styles.showroomTitle}>Showroom Esmeralda</div>
              <div className={styles.showroomText}>
                Bosque de Arrayán 1, Int. 301 N1 · Bosque Esmeralda<br />
                City Center Bosque Esmeralda, Cdad. López Mateos<br />
                Abierto todos los días · 9:00 – 18:00
              </div>
              <div className={styles.showroomPhone}>55 5434 0686</div>
            </div>
          </aside>
        </div>

        {similares.length > 0 && (
          <div className={styles.similaresSection}>
            <h2 className={styles.similaresTitle}>Unidades similares</h2>
            <div className={styles.similaresGrid}>
              {similares.map((c) => (
                <CarCard key={c.slug} car={c} />
              ))}
            </div>
          </div>
        )}

        <Link to="/inventario" className={styles.backBtnBottom}>← Volver al inventario</Link>
      </div>

      {/* ---------- modal de solicitud (3 pasos) ---------- */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderTop}>
                <span className={styles.modalHeaderLabel}>PRE-APROBACIÓN DE CRÉDITO</span>
                <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
              </div>
              <h2 className={styles.modalTitle}>Solicitud de financiamiento</h2>
              <p className={styles.modalSubtitle}>
                Estás solicitando para: <span className={styles.modalSubtitleBold}>{car.name}</span>{' '}
                <span className={styles.modalSubtitleAccent}>{mxn(q.total)}/mes estimado</span>
              </p>

              <div className={styles.progressBar}>
                <div className={`${styles.progressSegment} ${formStep >= 1 ? styles.progressSegmentActive : ''}`}></div>
                <div className={`${styles.progressSegment} ${formStep >= 2 ? styles.progressSegmentActive : ''}`}></div>
                <div className={`${styles.progressSegment} ${formStep >= 3 ? styles.progressSegmentActive : ''}`}></div>
              </div>
            </div>

            <div className={styles.modalBody}>
              <form onSubmit={formStep === 3 ? handleSubmitForm : (e) => e.preventDefault()}>
                {formStep === 1 && (
                  <div className={styles.stepContainer}>
                    <h3 className={styles.stepTitle}>Paso 1 de 3 - Datos personales</h3>

                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>Nombre(s) *</label>
                        <input type="text" required value={formData.nombres} onChange={(e) => handleInputChange('nombres', e.target.value)} />
                      </div>
                      <div className={styles.formField}>
                        <label>Apellidos *</label>
                        <input type="text" required value={formData.apellidos} onChange={(e) => handleInputChange('apellidos', e.target.value)} />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>Fecha de nacimiento *</label>
                        <input type="date" required value={formData.fechaNacimiento} onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)} />
                      </div>
                      <div className={styles.formField}>
                        <label>RFC *</label>
                        <input type="text" required placeholder="XXXXXXXXXXXXX" value={formData.rfc} onChange={(e) => handleInputChange('rfc', e.target.value)} />
                      </div>
                    </div>

                    <div className={styles.formField}>
                      <label>Género *</label>
                      <div className={styles.toggleRow}>
                        <button type="button" className={`${styles.toggleBtn} ${formData.genero === 'Masculino' ? styles.toggleBtnActive : ''}`} onClick={() => handleInputChange('genero', 'Masculino')}>Masculino</button>
                        <button type="button" className={`${styles.toggleBtn} ${formData.genero === 'Femenino' ? styles.toggleBtnActive : ''}`} onClick={() => handleInputChange('genero', 'Femenino')}>Femenino</button>
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>Estado civil *</label>
                        <select required value={formData.estadoCivil} onChange={(e) => handleInputChange('estadoCivil', e.target.value)} className={styles.formSelect}>
                          <option value="">Selecciona...</option>
                          <option value="Soltero">Soltero(a)</option>
                          <option value="Casado">Casado(a)</option>
                          <option value="Divorciado">Divorciado(a)</option>
                          <option value="Viudo">Viudo(a)</option>
                          <option value="Union Libre">Unión Libre</option>
                        </select>
                      </div>
                      <div className={styles.formField}>
                        <label>Dependientes económicos *</label>
                        <input type="number" required min="0" value={formData.dependientes} onChange={(e) => handleInputChange('dependientes', e.target.value)} />
                      </div>
                    </div>

                    <div className={styles.formField}>
                      <label>Nivel de estudios *</label>
                      <select required value={formData.nivelEstudios} onChange={(e) => handleInputChange('nivelEstudios', e.target.value)} className={styles.formSelect}>
                        <option value="">Selecciona...</option>
                        <option value="Primaria">Primaria</option>
                        <option value="Secundaria">Secundaria</option>
                        <option value="Bachillerato">Bachillerato / Preparatoria</option>
                        <option value="Licenciatura">Licenciatura / Profesional</option>
                        <option value="Posgrado">Posgrado / Maestría / Doctorado</option>
                      </select>
                    </div>

                    <div className={styles.formField}>
                      <label>¿Tiene vehículo propio? *</label>
                      <div className={styles.toggleRow}>
                        <button type="button" className={`${styles.toggleBtn} ${formData.vehiculoPropio === 'Si' ? styles.toggleBtnActive : ''}`} onClick={() => handleInputChange('vehiculoPropio', 'Si')}>Sí</button>
                        <button type="button" className={`${styles.toggleBtn} ${formData.vehiculoPropio === 'No' ? styles.toggleBtnActive : ''}`} onClick={() => handleInputChange('vehiculoPropio', 'No')}>No</button>
                      </div>
                    </div>

                    <div className={styles.modalFooterSingle}>
                      <button
                        type="button" onClick={handleNextStep} className={styles.modalSubmitBtn}
                        disabled={!formData.nombres || !formData.apellidos || !formData.fechaNacimiento || !formData.rfc || !formData.genero || !formData.estadoCivil || !formData.nivelEstudios || !formData.vehiculoPropio}
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}

                {formStep === 2 && (
                  <div className={styles.stepContainer}>
                    <h3 className={styles.stepTitle}>Paso 2 de 3 - Domicilio</h3>

                    <div className={styles.formField}>
                      <label>Calle *</label>
                      <input type="text" required value={formData.calle} onChange={(e) => handleInputChange('calle', e.target.value)} />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>No. exterior *</label>
                        <input type="text" required value={formData.noExterior} onChange={(e) => handleInputChange('noExterior', e.target.value)} />
                      </div>
                      <div className={styles.formField}>
                        <label>No. interior</label>
                        <input type="text" placeholder="Opcional" value={formData.noInterior} onChange={(e) => handleInputChange('noInterior', e.target.value)} />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>Código postal *</label>
                        <input type="text" required value={formData.codigoPostal} onChange={(e) => handleInputChange('codigoPostal', e.target.value)} />
                      </div>
                      <div className={styles.formField}>
                        <label>Colonia *</label>
                        <input type="text" required value={formData.colonia} onChange={(e) => handleInputChange('colonia', e.target.value)} />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>Alcaldia / Municipio *</label>
                        <input type="text" required value={formData.municipio} onChange={(e) => handleInputChange('municipio', e.target.value)} />
                      </div>
                      <div className={styles.formField}>
                        <label>Estado *</label>
                        <input type="text" required value={formData.estado} onChange={(e) => handleInputChange('estado', e.target.value)} />
                      </div>
                    </div>

                    <div className={styles.formField}>
                      <label>Tipo de vivienda *</label>
                      <select required value={formData.tipoVivienda} onChange={(e) => handleInputChange('tipoVivienda', e.target.value)} className={styles.formSelect}>
                        <option value="">Selecciona...</option>
                        <option value="Propia">Propia</option>
                        <option value="Rentada">Rentada</option>
                        <option value="Familiar">Familiar (Padres/Parientes)</option>
                        <option value="Hipotecada">Hipotecada / Pagándola</option>
                      </select>
                    </div>

                    <div className={styles.formField}>
                      <label>Años de vivir en el domicilio *</label>
                      <input type="number" required min="0" value={formData.anosDomicilio} onChange={(e) => handleInputChange('anosDomicilio', e.target.value)} />
                    </div>

                    <div className={styles.modalFooterSplit}>
                      <button type="button" onClick={handlePrevStep} className={styles.modalBackBtn}>Atrás</button>
                      <button
                        type="button" onClick={handleNextStep} className={styles.modalSubmitBtn}
                        disabled={!formData.calle || !formData.noExterior || !formData.codigoPostal || !formData.colonia || !formData.municipio || !formData.estado || !formData.tipoVivienda}
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}

                {formStep === 3 && (
                  <div className={styles.stepContainer}>
                    <h3 className={styles.stepTitle}>Paso 3 de 3 - Contacto</h3>

                    <div className={styles.formField}>
                      <label>Número de celular (WhatsApp) *</label>
                      <input type="tel" required placeholder="10 dígitos" value={formData.celular} onChange={(e) => handleInputChange('celular', e.target.value)} />
                    </div>

                    <div className={styles.infoBanner}>Te contactaremos por WhatsApp a este número para continuar tu trámite.</div>

                    <div className={styles.formField}>
                      <label>Teléfono fijo</label>
                      <input type="tel" placeholder="Opcional" value={formData.telefonoFijo} onChange={(e) => handleInputChange('telefonoFijo', e.target.value)} />
                    </div>

                    <div className={styles.formField}>
                      <label>Correo electrónico *</label>
                      <input type="email" required placeholder="tucorreo@ejemplo.com" value={formData.correo} onChange={(e) => handleInputChange('correo', e.target.value)} />
                    </div>

                    <div className={styles.checkboxField}>
                      <input type="checkbox" id="autorizacionCheckbox" checked={formData.autorizacion} onChange={(e) => handleInputChange('autorizacion', e.target.checked)} required />
                      <label htmlFor="autorizacionCheckbox">
                        Autorizo a Grupo Autovía Distribuidora Automotriz SAPI de CV a tratar mis datos personales conforme a
                        su <a href="#privacy" onClick={(e) => e.preventDefault()}>Aviso de Privacidad</a> para dar seguimiento a
                        mi solicitud de financiamiento.
                      </label>
                    </div>

                    <div className={styles.modalFooterSplit}>
                      <button type="button" onClick={handlePrevStep} className={styles.modalBackBtn}>Atrás</button>
                      <button type="submit" className={styles.modalSubmitBtn} disabled={!formData.celular || !formData.correo || !formData.autorizacion}>
                        Enviar solicitud
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ---------- lightbox ---------- */}
      {isLightboxOpen && (
        <div className={styles.lightboxOverlay} onClick={() => setIsLightboxOpen(false)}>
          <div className={styles.lightboxHeader}>
            <span className={styles.lightboxCounter}>{activeImageIndex + 1} / {car.images.length}</span>
            <button className={styles.lightboxCloseBtn} onClick={() => setIsLightboxOpen(false)}>×</button>
          </div>
          <button className={styles.lightboxArrowLeft} onClick={handlePrevImage} aria-label="Anterior">‹</button>
          <div className={styles.lightboxImageContainer} onClick={(e) => e.stopPropagation()}>
            <img src={getCarImageUrl(car.images[activeImageIndex])} alt={`${car.name} - Ampliada`} className={styles.lightboxImage} />
          </div>
          <button className={styles.lightboxArrowRight} onClick={handleNextImage} aria-label="Siguiente">›</button>
        </div>
      )}
    </section>
  );
}
