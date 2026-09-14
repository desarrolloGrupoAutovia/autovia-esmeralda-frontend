import { useRef } from 'react';

/* Los carruseles horizontales del sitio (galería, categorías, marcas,
   testimonios) tienen scrollbar oculta y solo los botones de flecha como
   pista de que hay más contenido — en desktop, sin scrollbar visible ni
   cursor de "mano", no es obvio que también se puede arrastrar con el
   mouse. Este hook agrega ese arrastre y el cursor grab/grabbing; el
   scroll con rueda/trackpad y los botones de flecha ya funcionaban solos
   y siguen intactos.

   refExterno: los componentes que ya tienen su propio useRef para los
   botones de flecha (scrollBy) lo pasan acá para compartir el mismo nodo,
   en vez de terminar con dos refs apuntando al mismo <div>. */
export function useArrastreHorizontal(refExterno) {
  const refPropio = useRef(null);
  const ref = refExterno || refPropio;
  const estado = useRef({ arrastrando: false, x0: 0, scroll0: 0, movido: false });

  const onMouseDown = (e) => {
    const el = ref.current;
    if (!el) return;
    /* Sin esto, el navegador arranca su propio "arrastrar imagen" nativo
       apenas el mousedown cae sobre un <img> (o un Link con una adentro,
       como las miniaturas de la galería) — se ve la miniatura "flotando"
       en vez de simplemente hacer scroll. preventDefault() en mousedown
       cancela ese drag nativo sin afectar el click normal. */
    e.preventDefault();
    estado.current = { arrastrando: true, x0: e.clientX, scroll0: el.scrollLeft, movido: false };
    el.classList.add('arrastrando');
    /* Seguir escuchando en document, no en el propio elemento: así el
       arrastre sigue funcionando aunque el cursor se salga del contenedor
       (el pedido explícito de "no importa si me voy por fuera") y se
       suelta en cualquier lugar de la página, no solo adentro. */
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    const el = ref.current;
    const st = estado.current;
    if (!el || !st.arrastrando) return;
    const dx = e.clientX - st.x0;
    if (Math.abs(dx) > 3) st.movido = true;
    el.scrollLeft = st.scroll0 - dx;
  };

  const onMouseUp = () => {
    const el = ref.current;
    estado.current.arrastrando = false;
    el?.classList.remove('arrastrando');
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  /* Si hubo arrastre real, el click que dispara el navegador después del
     mouseup es el del Link/botón bajo el cursor — hay que cancelarlo, o
     arrastrar la galería terminaría "clickeando" la foto de abajo. */
  const onClickCapture = (e) => {
    if (estado.current.movido) { e.preventDefault(); e.stopPropagation(); }
  };

  /* Cinturón y tirantes contra el drag nativo de imágenes: algunos
     navegadores disparan "dragstart" recién en el primer mousemove
     después del mousedown, no en el mousedown mismo, así que el
     preventDefault() de ahí puede llegar tarde para esa foto puntual —
     esto lo ataja directo en el evento que realmente lo dispara. */
  const onDragStart = (e) => e.preventDefault();

  return {
    ref,
    handlers: {
      onMouseDown,
      onClickCapture,
      onDragStart,
    },
  };
}
