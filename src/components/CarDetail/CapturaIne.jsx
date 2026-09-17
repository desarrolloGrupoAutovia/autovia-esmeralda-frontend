import React, { useRef } from 'react';
import styles from './CarDetail.module.css';

/* Dos formas de conseguir la foto, igual que ya se usaba en Movinex antes
   de pasar al flujo hosteado de Verificamex: "Subir foto" abre la galería
   del cliente (sin capture), "Tomar foto" abre la cámara directo en
   celulares (capture="environment"). Son dos <input type="file"> ocultos
   distintos porque el atributo capture no se puede alternar en uno solo. */
export default function CapturaIne({ label, archivo, onCambio }) {
  const inputGaleria = useRef(null);
  const inputCamara = useRef(null);

  return (
    <div className={styles.formField}>
      <label>{label}</label>
      {archivo ? (
        <div className={styles.ineArchivoListo}>
          <span>{archivo.name}</span>
          <button type="button" onClick={() => onCambio(null)} className={styles.ineQuitarBtn}>
            Quitar
          </button>
        </div>
      ) : (
        <div className={styles.ineBotones}>
          <button type="button" onClick={() => inputGaleria.current?.click()} className={styles.ineCapturaBtn}>
            Subir foto
          </button>
          <button type="button" onClick={() => inputCamara.current?.click()} className={styles.ineCapturaBtn}>
            Tomar foto
          </button>
        </div>
      )}
      <input
        ref={inputGaleria} type="file" accept="image/*" hidden
        onChange={(e) => onCambio(e.target.files?.[0] || null)}
      />
      <input
        ref={inputCamara} type="file" accept="image/*" capture="environment" hidden
        onChange={(e) => onCambio(e.target.files?.[0] || null)}
      />
    </div>
  );
}
