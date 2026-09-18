import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import styles from './CarDetail.module.css';
import CarCard from '../CarCard/CarCard';
import { getCarImageUrl, parsePrice, parseAnio, parseKm } from '../../lib/cars';
import { mxn, ENGANCHE_MINIMO_PCT } from '../../lib/credito';
import { useCotizador } from '../../lib/useCotizador';
import { useCatalogo } from '../../lib/catalogo';
import { crearSolicitud, actualizarSolicitud, verificarIneSolicitud, consultarEstadoIne, reanudarSolicitud } from '../../lib/solicitudes';
import { useArrastreHorizontal } from '../../lib/useArrastreHorizontal';
import CapturaIne from './CapturaIne';

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
  const [searchParams] = useSearchParams();
  const { autos, cargando: catalogoCargando, error: catalogoError } = useCatalogo();
  const thumbsArrastre = useArrastreHorizontal();
  const [car, setCar] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 'celular' y 'codigo' verifican el WhatsApp antes de dejar avanzar al
  // resto del formulario (1, 2, 3, 4) — mismo patrón que Movinex.
  const [formPaso, setFormPaso] = useState('celular');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [formData, setFormData] = useState({
    nombres: '', apellidos: '', fechaNacimiento: '', curp: '', genero: '',
    estadoCivil: '', dependientes: '0', nivelEstudios: '', vehiculoPropio: '',
    ocupacion: '', empresa: '',
    calle: '', noExterior: '', noInterior: '', codigoPostal: '', colonia: '',
    municipio: '', estado: '', tipoVivienda: '', anosDomicilio: '0',
    celular: '', telefonoFijo: '', correo: '', autorizacion: false,
  });

  // ---------- paso "celular": celular + consentimiento (sin OTP por ahora) ----------
  const [otpEnviando, setOtpEnviando] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [aceptaContacto, setAceptaContacto] = useState(false);

  // Id de la solicitud creada en autovia-dashboard apenas se verifica el
  // OTP; cada "Siguiente" guarda el paso correspondiente en esa misma fila.
  const [solicitudId, setSolicitudId] = useState(null);
  const [guardandoPaso, setGuardandoPaso] = useState(false);
  const [envioCompletado, setEnvioCompletado] = useState(false);

  // ---------- paso 4: verificación de la INE (VerificaMex) ----------
  const [ineFrente, setIneFrente] = useState(null);
  const [ineReverso, setIneReverso] = useState(null);
  const [ineError, setIneError] = useState('');
  const [ineVerificando, setIneVerificando] = useState(false);

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

  /* Reanudar una solicitud incompleta desde el link de seguimiento
     (/inventario/:slug?reanudar=<id>&celular=...): trae lo ya capturado,
     salta el OTP (ese celular ya se verificó cuando se creó la
     solicitud) y abre el modal directo en el paso siguiente al último
     que se guardó. */
  useEffect(() => {
    const reanudarId = searchParams.get('reanudar');
    const celularReanudar = searchParams.get('celular');
    if (!car || !reanudarId || !celularReanudar) return;

    reanudarSolicitud(reanudarId, celularReanudar)
      .then((s) => {
        setSolicitudId(reanudarId);
        setFormData((prev) => ({
          ...prev,
          celular: celularReanudar,
          nombres: s.nombres || '', apellidos: s.apellidos || '',
          fechaNacimiento: s.fechaNacimiento || '', curp: s.curp || '',
          genero: s.genero || '', estadoCivil: s.estadoCivil || '',
          dependientes: s.dependientes != null ? String(s.dependientes) : '0',
          nivelEstudios: s.nivelEstudios || '', vehiculoPropio: s.vehiculoPropio || '',
          ocupacion: s.ocupacion || '', empresa: s.empresa || '',
          calle: s.calle || '', noExterior: s.noExterior || '', noInterior: s.noInterior || '',
          codigoPostal: s.codigoPostal || '', colonia: s.colonia || '',
          municipio: s.municipio || '', estado: s.estadoMx || '',
          tipoVivienda: s.tipoVivienda || '',
          anosDomicilio: s.anosDomicilio != null ? String(s.anosDomicilio) : '0',
          telefonoFijo: s.telefonoFijo || '', correo: s.correo || '',
          autorizacion: !!s.autorizacion,
        }));
        if (s.enganchePct) setDown(s.enganchePct);
        if (s.plazoMeses) setPlazo(s.plazoMeses);
        setFormPaso(Math.min((s.pasoAlcanzado || 0) + 1, 4));
        setIsModalOpen(true);
      })
      .catch(() => {
        // Si el link ya no es válido (celular no coincide, solicitud
        // borrada), simplemente no se abre nada — el cliente puede
        // empezar de cero con el botón normal de "Solicita tu crédito".
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car]);

  /* SIN verificación por OTP (2026-09-18, temporal): mientras Meta no
     apruebe el nombre para mostrar del número de WhatsApp, no hay forma
     de mandarle un código real a nadie que no sea el celular de prueba
     del equipo — así que este paso solo pide el celular y un check de
     consentimiento para ser contactado ahí. Cuando el número quede
     aprobado, este paso vuelve a pedir y verificar el código (ver
     lib/otp.js, que queda intacto sin usarse por ahora). */
  const handleAceptarContacto = async () => {
    if (formData.celular.length < 10 || !aceptaContacto) return;
    setOtpEnviando(true);
    setOtpError('');
    try {
      const id = await crearSolicitud({
        celular: formData.celular,
        autoSlug: car.slug,
        autoNombre: car.name,
        autoPrecio: parsedPrice,
        enganchePct: down,
        plazoMeses: plazo,
        pagoMensual: q.total,
      });
      setSolicitudId(id);
      setFormPaso(1);
    } catch (e) {
      setOtpError(e.message || 'No se pudo guardar tu solicitud. Intenta de nuevo.');
    } finally {
      setOtpEnviando(false);
    }
  };

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

  const guardarPaso = async (paso, datos) => {
    if (!solicitudId) return;
    setGuardandoPaso(true);
    try {
      await actualizarSolicitud(solicitudId, formData.celular, paso, datos);
    } catch {
      // El cliente sigue avanzando aunque el guardado falle; los datos ya
      // quedaron en formData y el paso 3 vuelve a mandar todo al backend.
    } finally {
      setGuardandoPaso(false);
    }
  };

  const handleNextStep = async () => {
    if (formPaso === 1) {
      await guardarPaso(1, {
        nombres: formData.nombres, apellidos: formData.apellidos, fechaNacimiento: formData.fechaNacimiento,
        curp: formData.curp, genero: formData.genero, estadoCivil: formData.estadoCivil,
        dependientes: formData.dependientes, nivelEstudios: formData.nivelEstudios, vehiculoPropio: formData.vehiculoPropio,
        ocupacion: formData.ocupacion, empresa: formData.empresa,
      });
    } else if (formPaso === 2) {
      await guardarPaso(2, {
        calle: formData.calle, noExterior: formData.noExterior, noInterior: formData.noInterior,
        codigoPostal: formData.codigoPostal, colonia: formData.colonia, municipio: formData.municipio,
        estadoMx: formData.estado, tipoVivienda: formData.tipoVivienda, anosDomicilio: formData.anosDomicilio,
      });
    }
    setFormPaso((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => setFormPaso((prev) => (prev === 1 ? 'celular' : Math.max(prev - 1, 1)));

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? car.images.length - 1 : prev - 1));
  };
  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === car.images.length - 1 ? 0 : prev + 1));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.autorizacion) return;

    await guardarPaso(3, {
      telefonoFijo: formData.telefonoFijo, correo: formData.correo, autorizacion: formData.autorizacion,
    });
    setFormPaso(4);
  };

  const leerComoBase64 = (archivo) => new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result);
    lector.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    lector.readAsDataURL(archivo);
  });

  const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // El backend responde de inmediato (no espera a VerificaMex) y sigue
  // verificando en segundo plano. Acá sí se espera un momento — se le
  // muestra al cliente "Verificando..." y recién cuando el backend
  // termina (o tras ~50s sin respuesta, para no trabarlo para siempre)
  // se pasa a la pantalla de confirmación final.
  const esperarResultadoIne = async () => {
    for (let intento = 0; intento < 20; intento++) {
      await esperar(2500);
      const d = await consultarEstadoIne(solicitudId, formData.celular);
      if (d.listo) return;
    }
  };

  const handleVerificarIne = async () => {
    if (!ineFrente || !ineReverso || !solicitudId) return;
    setIneVerificando(true);
    setIneError('');
    try {
      const [frenteBase64, reversoBase64] = await Promise.all([
        leerComoBase64(ineFrente),
        leerComoBase64(ineReverso),
      ]);
      await verificarIneSolicitud(solicitudId, formData.celular, frenteBase64, reversoBase64);
      await esperarResultadoIne();
      setEnvioCompletado(true);
    } catch (e) {
      setIneError(e.message || 'No se pudo verificar la INE. Intenta de nuevo.');
    } finally {
      setIneVerificando(false);
    }
  };

  const cerrarModalSolicitud = () => {
    setIsModalOpen(false);
    setFormPaso('celular');
    setEnvioCompletado(false);
    setSolicitudId(null);
    setIneFrente(null);
    setIneReverso(null);
    setIneError('');
    setAceptaContacto(false);
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
              <div className={styles.thumbnails} ref={thumbsArrastre.ref} {...thumbsArrastre.handlers}>
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
                onClick={() => { setIsModalOpen(true); setFormPaso('celular'); setOtpError(''); setAceptaContacto(false); setSolicitudId(null); setEnvioCompletado(false); }}
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
                <button className={styles.closeBtn} onClick={cerrarModalSolicitud}>×</button>
              </div>
              {!envioCompletado && (
                <>
                  <h2 className={styles.modalTitle}>Solicitud de financiamiento</h2>
                  <p className={styles.modalSubtitle}>
                    Estás solicitando para: <span className={styles.modalSubtitleBold}>{car.name}</span>{' '}
                    <span className={styles.modalSubtitleAccent}>{mxn(q.total)}/mes estimado</span>
                  </p>

                  <div className={styles.progressBar}>
                    <div className={`${styles.progressSegment} ${styles.progressSegmentActive}`}></div>
                    <div className={`${styles.progressSegment} ${typeof formPaso === 'number' && formPaso >= 1 ? styles.progressSegmentActive : ''}`}></div>
                    <div className={`${styles.progressSegment} ${typeof formPaso === 'number' && formPaso >= 2 ? styles.progressSegmentActive : ''}`}></div>
                    <div className={`${styles.progressSegment} ${typeof formPaso === 'number' && formPaso >= 3 ? styles.progressSegmentActive : ''}`}></div>
                    <div className={`${styles.progressSegment} ${typeof formPaso === 'number' && formPaso >= 4 ? styles.progressSegmentActive : ''}`}></div>
                  </div>
                </>
              )}
            </div>

            <div className={styles.modalBody}>
              {envioCompletado && (
                <div className={styles.stepContainer}>
                  <h3 className={styles.stepTitle}>¡Listo, recibimos tu solicitud!</h3>
                  <div className={styles.infoBanner}>
                    En un lapso de 15 minutos a 24 horas se realizará tu preaprobación. Te contactaremos por WhatsApp al{' '}
                    {formData.celular} para continuar tu trámite de financiamiento para el {car.name}.
                  </div>

                  <div className={styles.modalFooterSingle}>
                    <button type="button" className={styles.modalSubmitBtn} onClick={cerrarModalSolicitud}>
                      Cerrar
                    </button>
                  </div>
                </div>
              )}

              {!envioCompletado && formPaso === 'celular' && (
                <div className={styles.stepContainer}>
                  <h3 className={styles.stepTitle}>Déjanos tu número de celular</h3>
                  <div className={styles.formField}>
                    <label>Número de celular (WhatsApp) *</label>
                    <input
                      type="tel"
                      placeholder="10 dígitos"
                      maxLength={10}
                      value={formData.celular}
                      onChange={(e) => handleInputChange('celular', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    />
                    <div className={styles.infoBanner}>Con este número te contactaremos por WhatsApp para dar seguimiento a tu solicitud.</div>
                  </div>
                  <div className={styles.checkboxField}>
                    <input
                      type="checkbox" id="aceptaContactoCheckbox"
                      checked={aceptaContacto}
                      onChange={(e) => setAceptaContacto(e.target.checked)}
                    />
                    <label htmlFor="aceptaContactoCheckbox">
                      Autorizo a Grupo Autovía a contactarme por WhatsApp a este número para dar seguimiento a mi solicitud.
                    </label>
                  </div>
                  {otpError && <div className={styles.errorMsg}>{otpError}</div>}
                  <div className={styles.modalFooterSingle}>
                    <button
                      type="button"
                      className={styles.modalSubmitBtn}
                      disabled={formData.celular.length < 10 || !aceptaContacto || otpEnviando}
                      onClick={handleAceptarContacto}
                    >
                      {otpEnviando ? 'Guardando...' : 'Continuar'}
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={formPaso === 3 ? handleSubmitForm : (e) => e.preventDefault()}>
                {formPaso === 1 && (
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
                        <label>CURP *</label>
                        <input
                          type="text" required placeholder="XXXXXXXXXXXXXXXXXX" maxLength={18}
                          value={formData.curp}
                          onChange={(e) => handleInputChange('curp', e.target.value.toUpperCase().slice(0, 18))}
                        />
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

                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>Ocupación o actividad económica *</label>
                        <input type="text" required value={formData.ocupacion} onChange={(e) => handleInputChange('ocupacion', e.target.value)} />
                      </div>
                      <div className={styles.formField}>
                        <label>Empresa o negocio donde labora *</label>
                        <input type="text" required value={formData.empresa} onChange={(e) => handleInputChange('empresa', e.target.value)} />
                      </div>
                    </div>

                    <div className={styles.modalFooterSingle}>
                      <button
                        type="button" onClick={handleNextStep} className={styles.modalSubmitBtn}
                        disabled={!formData.nombres || !formData.apellidos || !formData.fechaNacimiento || !formData.curp || !formData.genero || !formData.estadoCivil || !formData.nivelEstudios || !formData.vehiculoPropio || !formData.ocupacion || !formData.empresa || guardandoPaso}
                      >
                        {guardandoPaso ? 'Guardando...' : 'Siguiente'}
                      </button>
                    </div>
                  </div>
                )}

                {formPaso === 2 && (
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
                        disabled={!formData.calle || !formData.noExterior || !formData.codigoPostal || !formData.colonia || !formData.municipio || !formData.estado || !formData.tipoVivienda || guardandoPaso}
                      >
                        {guardandoPaso ? 'Guardando...' : 'Siguiente'}
                      </button>
                    </div>
                  </div>
                )}

                {formPaso === 3 && !envioCompletado && (
                  <div className={styles.stepContainer}>
                    <h3 className={styles.stepTitle}>Paso 3 de 4 - Contacto</h3>

                    <div className={styles.infoBanner}>Te contactaremos por WhatsApp al {formData.celular} para continuar tu trámite.</div>

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
                        su <a href="/aviso-privacidad" target="_blank" rel="noreferrer">Aviso de Privacidad</a> para dar seguimiento a
                        mi solicitud de financiamiento.
                      </label>
                    </div>

                    <div className={styles.modalFooterSplit}>
                      <button type="button" onClick={handlePrevStep} className={styles.modalBackBtn}>Atrás</button>
                      <button
                        type="submit" className={styles.modalSubmitBtn}
                        disabled={!formData.celular || !formData.correo || !formData.autorizacion || guardandoPaso}
                      >
                        {guardandoPaso ? 'Guardando...' : 'Siguiente'}
                      </button>
                    </div>
                  </div>
                )}
              </form>

              {formPaso === 4 && !envioCompletado && (
                <div className={styles.stepContainer}>
                  <h3 className={styles.stepTitle}>Paso 4 de 4 - Verifica tu identidad</h3>
                  <div className={styles.infoBanner}>
                    Sube o toma una foto del frente y del reverso de tu INE para confirmar tu identidad. Es el último paso.
                  </div>

                  <CapturaIne
                    label="Frente de tu INE *"
                    archivo={ineFrente}
                    onCambio={(archivo) => { setIneFrente(archivo); setIneError(''); }}
                  />
                  <CapturaIne
                    label="Reverso de tu INE *"
                    archivo={ineReverso}
                    onCambio={(archivo) => { setIneReverso(archivo); setIneError(''); }}
                  />

                  {ineError && <div className={styles.errorMsg}>{ineError}</div>}
                  {ineVerificando && (
                    <div className={styles.infoBanner}>
                      Estamos verificando tu identidad. Esto puede tardar hasta un minuto — no cierres esta ventana.
                    </div>
                  )}
                  <div className={styles.modalFooterSplit}>
                    <button type="button" onClick={handlePrevStep} className={styles.modalBackBtn} disabled={ineVerificando}>
                      Atrás
                    </button>
                    <button
                      type="button" onClick={handleVerificarIne} className={styles.modalSubmitBtn}
                      disabled={!ineFrente || !ineReverso || ineVerificando}
                    >
                      {ineVerificando ? (<><span className={styles.spinner}></span> Verificando...</>) : 'Enviar solicitud'}
                    </button>
                  </div>
                </div>
              )}
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
