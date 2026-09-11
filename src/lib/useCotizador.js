import { useState, useMemo } from 'react';
import { cotizar, ENGANCHE_MINIMO_PCT } from './credito';

/* Estado del simulador de crédito, compartido entre la sección Autovía
   Credit del Home y el panel de CarDetail. */
export function useCotizador({ precioInicial = 419900, plazoInicial = 48, engancheMinimo = ENGANCHE_MINIMO_PCT } = {}) {
  const [price, setPrice] = useState(precioInicial);
  const [down, setDown] = useState(engancheMinimo);
  const [plazo, setPlazo] = useState(plazoInicial);

  const downEfectivo = Math.max(engancheMinimo, down);
  const q = useMemo(() => cotizar(price, downEfectivo, plazo), [price, downEfectivo, plazo]);

  return {
    price, setPrice,
    down: downEfectivo, setDown,
    plazo, setPlazo,
    engancheMinimo,
    q,
  };
}
