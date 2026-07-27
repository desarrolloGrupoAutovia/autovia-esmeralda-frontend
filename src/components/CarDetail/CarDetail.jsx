import React, { useState, useEffect } from 'react';
import styles from './CarDetail.module.css';
import carsDetailed from '../../assets/cars_detailed.json';

const carImageModules = import.meta.glob('../../assets/images/cars/**/*.webp', { eager: true });

export default function CarDetail({ carSlug, onBack }) {
  const [car, setCar] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Credit Calculator state
  const [enganchePercentage, setEnganchePercentage] = useState(35);
  const [plazoMonths, setPlazoMonths] = useState(48);

  // Modal forms & Lightbox State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    rfc: '',
    genero: '',
    estadoCivil: '',
    dependientes: '0',
    nivelEstudios: '',
    vehiculoPropio: '',
    calle: '',
    noExterior: '',
    noInterior: '',
    codigoPostal: '',
    colonia: '',
    municipio: '',
    estado: '',
    tipoVivienda: '',
    anosDomicilio: '0',
    celular: '',
    telefonoFijo: '',
    correo: '',
    autorizacion: false
  });

  useEffect(() => {
    const foundCar = carsDetailed.find(c => c.slug === carSlug);
    if (foundCar) {
      setCar(foundCar);
      setActiveImageIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [carSlug]);

  if (!car) {
    return (
      <section className={styles.detailSection}>
        <div className={styles.container}>
          <button className={styles.backBtn} onClick={onBack}>
            ← Volver al inventario
          </button>
          <div>Cargando datos del vehículo...</div>
        </div>
      </section>
    );
  }

  const getCarImageUrl = (imagePath) => {
    const path = `../../assets/images/cars/${imagePath}`;
    return carImageModules[path] ? carImageModules[path].default : '';
  };

  const parsedPrice = parseFloat(car.price.replace(/[^0-9.-]+/g, ""));
  
  const getMonthlyPayment = () => {
    const rateAnnual = 0.412; 
    const rateMonthly = rateAnnual / 12;
    const downPayment = parsedPrice * (enganchePercentage / 100);
    const loanAmount = parsedPrice - downPayment;
    
    const payment = loanAmount * (rateMonthly * Math.pow(1 + rateMonthly, plazoMonths)) / (Math.pow(1 + rateMonthly, plazoMonths) - 1);
    return Math.round(payment);
  };

  const formattedDownPayment = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  }).format(parsedPrice * (enganchePercentage / 100));

  const formattedMonthlyPayment = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  }).format(getMonthlyPayment());

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => setFormStep(prev => Math.min(prev + 1, 3));
  const handlePrevStep = () => setFormStep(prev => Math.max(prev - 1, 1));

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev === 0 ? car.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev === car.images.length - 1 ? 0 : prev + 1));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.autorizacion) return;

    const message = `*SOLICITUD DE FINANCIAMIENTO*\n` +
                    `Estás solicitando para: *${car.name}*\n` +
                    `• Pago mensual: ${formattedMonthlyPayment}/mes\n` +
                    `• Enganche: ${enganchePercentage}% (${formattedDownPayment})\n` +
                    `• Plazo: ${plazoMonths} meses\n\n` +
                    `*Datos Personales:*\n` +
                    `• Nombre: ${formData.nombres} ${formData.apellidos}\n` +
                    `• RFC: ${formData.rfc}\n` +
                    `• Celular: ${formData.celular}\n` +
                    `• Correo: ${formData.correo}\n` +
                    `• Domicilio: ${formData.calle}, Ext: ${formData.noExterior}, CP: ${formData.codigoPostal}, ${formData.colonia}, ${formData.municipio}, ${formData.estado}`;
    
    const url = `https://wa.me/525554340686?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    
    setIsModalOpen(false);
    setFormStep(1);
  };

  const defaultWhatsappUrl = `https://wa.me/525554340686?text=${encodeURIComponent(
    `Hola, estoy interesado en el vehículo ${car.name} (${car.price}) que vi en su sitio web de Autovía Esmeralda.`
  )}`;

  const currentCarImage = getCarImageUrl(car.images[activeImageIndex]) || `https://via.placeholder.com/800x600?text=${encodeURIComponent(car.name)}`;

  return (
    <section className={styles.detailSection}>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={onBack}>
          ← Volver al inventario
        </button>

        <div className={styles.layout}>
          
          {/* Gallery Layout (Horizontal below, auto height container) */}
          <div className={styles.gallery}>
            {/* Main display container (no fixed aspect ratio padding, adapts to image height) */}
            <div 
              className={styles.mainImageWrapper} 
              onClick={() => setIsLightboxOpen(true)}
              title="Haz clic para ampliar la imagen"
            >
              <img 
                src={currentCarImage} 
                alt={car.name} 
                className={styles.mainImage}
              />
              <span className={styles.zoomHint}>🔍 Haz clic para ampliar</span>
            </div>

            {/* Horizontal list of thumbnails below the main image */}
            {car.images.length > 1 && (
              <div className={styles.thumbnails}>
                {car.images.map((imagePath, index) => {
                  const thumbUrl = getCarImageUrl(imagePath);
                  return (
                    <div 
                      key={index} 
                      className={`${styles.thumbWrapper} ${index === activeImageIndex ? styles.active : ''}`}
                      onMouseEnter={() => setActiveImageIndex(index)}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img 
                        src={thumbUrl} 
                        alt={`${car.name} - Vista ${index + 1}`} 
                        className={styles.thumbImage}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details Panel */}
          <div className={styles.detailsPanel}>
            <span className={styles.categoryTag}>{car.category}</span>
            <h1 className={styles.carName}>{car.name}</h1>
            <div className={styles.price}>{car.price}</div>

            {/* Specifications Grid */}
            <div className={styles.specsGrid}>
              {car.km && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Kilometraje</span>
                  <span className={styles.specValue}>{car.km} Km</span>
                </div>
              )}
              {car.motor && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Motor</span>
                  <span className={styles.specValue}>{car.motor}</span>
                </div>
              )}
              {car.potencia && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Potencia</span>
                  <span className={styles.specValue}>{car.potencia}</span>
                </div>
              )}
              {car.transmision && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Transmisión</span>
                  <span className={styles.specValue}>{car.transmision}</span>
                </div>
              )}
              {car.combustible && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Combustible</span>
                  <span className={styles.specValue}>{car.combustible}</span>
                </div>
              )}
              {car.capacidad && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Capacidad</span>
                  <span className={styles.specValue}>{car.capacidad}</span>
                </div>
              )}
              {car.traccion && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Tracción</span>
                  <span className={styles.specValue}>{car.traccion}</span>
                </div>
              )}
            </div>

            {/* Equipment Description */}
            {car.equipamiento && (
              <div className={styles.equipmentSection}>
                <h3 className={styles.sectionTitle}>Equipamiento & Detalles</h3>
                <p className={styles.equipmentText}>{car.equipamiento}</p>
              </div>
            )}

            {/* Connectivity */}
            {car.conectividad && (
              <div className={styles.equipmentSection}>
                <h3 className={styles.sectionTitle}>Conectividad</h3>
                <p className={styles.equipmentText}>{car.conectividad}</p>
              </div>
            )}

            {/* Security */}
            {car.seguridad && (
              <div className={styles.equipmentSection}>
                <h3 className={styles.sectionTitle}>Seguridad</h3>
                <p className={styles.equipmentText}>{car.seguridad}</p>
              </div>
            )}

            {/* Direct Contact Button */}
            <a 
              href={defaultWhatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.whatsappBtn}
              style={{ marginBottom: '40px' }}
            >
              💬 Preguntar por este auto
            </a>

            {/* CREDIT CALCULATOR WIDGET */}
            <div className={styles.calculatorCard}>
              <div className={styles.calcHeader}>
                <span className={styles.calcHeaderLabel}>COTIZADOR DE CRÉDITO</span>
                <h3 className={styles.calcHeaderName}>{car.name}</h3>
                <div className={styles.calcHeaderPrice}>
                  {car.price} <span className={styles.calcHeaderPriceSub}>precio de contado</span>
                </div>
              </div>
              <div className={styles.calcBody}>
                <div className={styles.calcRow}>
                  <span className={styles.calcLabel}>Enganche</span>
                  <span className={styles.calcValueHighlight}>{enganchePercentage}% · {formattedDownPayment}</span>
                </div>
                
                <div className={styles.sliderContainer}>
                  <input 
                    type="range" 
                    min="20" 
                    max="80" 
                    step="5"
                    value={enganchePercentage} 
                    onChange={(e) => setEnganchePercentage(parseInt(e.target.value))}
                    className={styles.rangeSlider}
                  />
                </div>

                <div className={styles.calcRow} style={{ marginTop: '20px' }}>
                  <span className={styles.calcLabel}>Plazo</span>
                  <span className={styles.calcValueHighlight}>{plazoMonths} meses</span>
                </div>

                <div className={styles.plazoButtons}>
                  {[12, 24, 36, 48].map((months) => (
                    <button 
                      key={months}
                      type="button"
                      className={`${styles.plazoBtn} ${plazoMonths === months ? styles.plazoBtnActive : ''}`}
                      onClick={() => setPlazoMonths(months)}
                    >
                      {months}
                    </button>
                  ))}
                </div>

                <div className={styles.paymentBox}>
                  <span className={styles.paymentLabel}>PAGO MENSUAL ESTIMADO</span>
                  <div className={styles.paymentValue}>
                    {formattedMonthlyPayment} <span className={styles.paymentValueSub}>/ mes</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={() => { setIsModalOpen(true); setFormStep(1); }}
                  className={styles.preApprovalBtn}
                >
                  Solicitar pre-aprobación →
                </button>

                <p className={styles.disclaimerText}>
                  Cotización informativa, no constituye una oferta de crédito ni resolución de pre-aprobación. Incluye tasa fija, IVA, GPS y seguro de vida; el seguro del auto se cotiza posterior a tu pre-autorización. El pago final está sujeto a aprobación y a la institución financiera.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* 3-STEP CREDIT REQUEST MODAL */}
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
                Estás solicitando para: <span className={styles.modalSubtitleBold}>{car.name}</span> <span className={styles.modalSubtitleGold}>{formattedMonthlyPayment}/mes estimado</span>
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
                        <input 
                          type="text" 
                          required 
                          value={formData.nombres}
                          onChange={(e) => handleInputChange('nombres', e.target.value)}
                        />
                      </div>
                      <div className={styles.formField}>
                        <label>Apellidos *</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.apellidos}
                          onChange={(e) => handleInputChange('apellidos', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>Fecha de nacimiento *</label>
                        <input 
                          type="date" 
                          required 
                          value={formData.fechaNacimiento}
                          onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                        />
                      </div>
                      <div className={styles.formField}>
                        <label>RFC *</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="XXXXXXXXXXXXX"
                          value={formData.rfc}
                          onChange={(e) => handleInputChange('rfc', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.formField}>
                      <label>Género *</label>
                      <div className={styles.toggleRow}>
                        <button 
                          type="button"
                          className={`${styles.toggleBtn} ${formData.genero === 'Masculino' ? styles.toggleBtnActive : ''}`}
                          onClick={() => handleInputChange('genero', 'Masculino')}
                        >
                          Masculino
                        </button>
                        <button 
                          type="button"
                          className={`${styles.toggleBtn} ${formData.genero === 'Femenino' ? styles.toggleBtnActive : ''}`}
                          onClick={() => handleInputChange('genero', 'Femenino')}
                        >
                          Femenino
                        </button>
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>Estado civil *</label>
                        <select 
                          required 
                          value={formData.estadoCivil}
                          onChange={(e) => handleInputChange('estadoCivil', e.target.value)}
                          className={styles.formSelect}
                        >
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
                        <input 
                          type="number" 
                          required 
                          min="0"
                          value={formData.dependientes}
                          onChange={(e) => handleInputChange('dependientes', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.formField}>
                      <label>Nivel de estudios *</label>
                      <select 
                        required 
                        value={formData.nivelEstudios}
                        onChange={(e) => handleInputChange('nivelEstudios', e.target.value)}
                        className={styles.formSelect}
                      >
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
                        <button 
                          type="button"
                          className={`${styles.toggleBtn} ${formData.vehiculoPropio === 'Si' ? styles.toggleBtnActive : ''}`}
                          onClick={() => handleInputChange('vehiculoPropio', 'Si')}
                        >
                          Sí
                        </button>
                        <button 
                          type="button"
                          className={`${styles.toggleBtn} ${formData.vehiculoPropio === 'No' ? styles.toggleBtnActive : ''}`}
                          onClick={() => handleInputChange('vehiculoPropio', 'No')}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div className={styles.modalFooterSingle}>
                      <button 
                        type="button" 
                        onClick={handleNextStep}
                        className={styles.modalSubmitBtn}
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
                      <input 
                        type="text" 
                        required 
                        value={formData.calle}
                        onChange={(e) => handleInputChange('calle', e.target.value)}
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>No. exterior *</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.noExterior}
                          onChange={(e) => handleInputChange('noExterior', e.target.value)}
                        />
                      </div>
                      <div className={styles.formField}>
                        <label>No. interior</label>
                        <input 
                          type="text" 
                          placeholder="Opcional"
                          value={formData.noInterior}
                          onChange={(e) => handleInputChange('noInterior', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>Código postal *</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.codigoPostal}
                          onChange={(e) => handleInputChange('codigoPostal', e.target.value)}
                        />
                      </div>
                      <div className={styles.formField}>
                        <label>Colonia *</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.colonia}
                          onChange={(e) => handleInputChange('colonia', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label>Alcaldia / Municipio *</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.municipio}
                          onChange={(e) => handleInputChange('municipio', e.target.value)}
                        />
                      </div>
                      <div className={styles.formField}>
                        <label>Estado *</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.estado}
                          onChange={(e) => handleInputChange('estado', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.formField}>
                      <label>Tipo de vivienda *</label>
                      <select 
                        required 
                        value={formData.tipoVivienda}
                        onChange={(e) => handleInputChange('tipoVivienda', e.target.value)}
                        className={styles.formSelect}
                      >
                        <option value="">Selecciona...</option>
                        <option value="Propia">Propia</option>
                        <option value="Rentada">Rentada</option>
                        <option value="Familiar">Familiar (Padres/Parientes)</option>
                        <option value="Hipotecada">Hipotecada / Pagándola</option>
                      </select>
                    </div>

                    <div className={styles.formField}>
                      <label>Años de vivir en el domicilio *</label>
                      <input 
                        type="number" 
                        required 
                        min="0"
                        value={formData.anosDomicilio}
                        onChange={(e) => handleInputChange('anosDomicilio', e.target.value)}
                      />
                    </div>

                    <div className={styles.modalFooterSplit}>
                      <button 
                        type="button" 
                        onClick={handlePrevStep}
                        className={styles.modalBackBtn}
                      >
                        Atrás
                      </button>
                      <button 
                        type="button" 
                        onClick={handleNextStep}
                        className={styles.modalSubmitBtn}
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
                      <input 
                        type="tel" 
                        required 
                        placeholder="10 dígitos"
                        value={formData.celular}
                        onChange={(e) => handleInputChange('celular', e.target.value)}
                      />
                    </div>

                    <div className={styles.infoBanner}>
                      Te contactaremos por WhatsApp a este número para continuar tu trámite.
                    </div>

                    <div className={styles.formField}>
                      <label>Teléfono fijo</label>
                      <input 
                        type="tel" 
                        placeholder="Opcional"
                        value={formData.telefonoFijo}
                        onChange={(e) => handleInputChange('telefonoFijo', e.target.value)}
                      />
                    </div>

                    <div className={styles.formField}>
                      <label>Correo electrónico *</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="tucorreo@ejemplo.com"
                        value={formData.correo}
                        onChange={(e) => handleInputChange('correo', e.target.value)}
                      />
                    </div>

                    <div className={styles.checkboxField}>
                      <input 
                        type="checkbox" 
                        id="autorizacionCheckbox"
                        checked={formData.autorizacion}
                        onChange={(e) => handleInputChange('autorizacion', e.target.checked)}
                        required
                      />
                      <label htmlFor="autorizacionCheckbox">
                        Autorizo a Grupo Autovía Distribuidora Automotriz SAPI de CV a tratar mis datos personales conforme a su <a href="#privacy" onClick={(e) => e.preventDefault()}>Aviso de Privacidad</a> para dar seguimiento a mi solicitud de financiamiento.
                      </label>
                    </div>

                    <div className={styles.modalFooterSplit}>
                      <button 
                        type="button" 
                        onClick={handlePrevStep}
                        className={styles.modalBackBtn}
                      >
                        Atrás
                      </button>
                      <button 
                        type="submit" 
                        className={styles.modalSubmitBtn}
                        disabled={!formData.celular || !formData.correo || !formData.autorizacion}
                      >
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

      {/* FULL-SCREEN LIGHTBOX GALLERY MODAL (MercadoLibre-style) */}
      {isLightboxOpen && (
        <div className={styles.lightboxOverlay} onClick={() => setIsLightboxOpen(false)}>
          <div className={styles.lightboxHeader}>
            <span className={styles.lightboxCounter}>{activeImageIndex + 1} / {car.images.length}</span>
            <button className={styles.lightboxCloseBtn} onClick={() => setIsLightboxOpen(false)}>×</button>
          </div>
          
          <button className={styles.lightboxArrowLeft} onClick={handlePrevImage} aria-label="Anterior">
            ‹
          </button>
          
          <div className={styles.lightboxImageContainer} onClick={(e) => e.stopPropagation()}>
            <img 
              src={getCarImageUrl(car.images[activeImageIndex])} 
              alt={`${car.name} - Ampliada`} 
              className={styles.lightboxImage}
            />
          </div>
          
          <button className={styles.lightboxArrowRight} onClick={handleNextImage} aria-label="Siguiente">
            ›
          </button>
        </div>
      )}
    </section>
  );
}
