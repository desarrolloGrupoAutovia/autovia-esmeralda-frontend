import React from 'react';
import LegalPage from './LegalPage';

export default function Garantia() {
  return (
    <LegalPage
      title="Garantía de Motor y Transmisión"
      subtitle="Grupo Autovía"
      updated="septiembre 2026"
    >
      <h2>1. Alcance de la garantía</h2>
      <p>
        GRUPO AUTOVÍA DISTRIBUIDORA AUTOMOTRIZ, S.A.P.I. DE C.V. ("AUTOVÍA") otorga al comprador de un
        vehículo seminuevo una garantía limitada que cubre fallas mecánicas de origen en motor y transmisión,
        en los términos y plazos siguientes:
      </p>
      <ul>
        <li><strong>Hasta 8 años de antigüedad:</strong> 1 año o 10,000 km, lo que ocurra primero.</li>
        <li><strong>Más de 8 años de antigüedad:</strong> 3 meses o 2,000 km, lo que ocurra primero.</li>
      </ul>
      <p>
        La antigüedad se calcula a partir del modelo/año del vehículo, tomando como fecha de referencia la de
        entrega al cliente.
      </p>

      <h2>2. Qué cubre</h2>
      <ul>
        <li><strong>Falla mecánica de motor:</strong> bloque, cabeza(s), sistema de distribución interno, bomba de aceite, componentes internos que fallen por defecto o desgaste no atribuible a mal uso.</li>
        <li><strong>Falla mecánica de transmisión:</strong> caja de velocidades (manual o automática), convertidor de par (en automáticas), diferencial cuando forme una sola unidad con la transmisión.</li>
      </ul>
      <p>
        Se considera "Falla Mecánica" la inutilidad operativa total o parcial de las piezas garantizadas, por
        rotura o degradación imprevista y no atribuible al uso indebido del vehículo.
      </p>

      <h2>3. Qué NO cubre</h2>
      <ul>
        <li>Componentes eléctricos, electrónicos, de confort, carrocería, tapicería, cristales, llantas, frenos, suspensión, aire acondicionado, ni accesorios.</li>
        <li>Mantenimiento programado (afinaciones, cambios de aceite, filtros, bandas, balatas, etc.).</li>
        <li>Daños derivados de accidente, siniestro, negligencia, mal uso, sobrecarga, modificación del vehículo, o falta de mantenimiento conforme al manual del fabricante.</li>
        <li>Vehículos utilizados para fines distintos al uso particular declarado al momento de la compra (por ejemplo, uso como taxi, plataforma de transporte, competencia, o carga pesada), salvo que se haya pactado expresamente lo contrario.</li>
        <li>Fallas preexistentes que hayan sido informadas por escrito al cliente antes de la venta.</li>
      </ul>

      <h2>4. Condiciones para hacer válida la garantía</h2>
      <ul>
        <li>El cliente deberá reportar la falla a AUTOVÍA dentro de los 3 días hábiles siguientes a que la detecte, a través de teléfono, WhatsApp o correo de reporte de averías.</li>
        <li>El vehículo deberá presentar el kilometraje real y no manipulado.</li>
        <li>El vehículo deberá haber recibido el mantenimiento preventivo indicado por el fabricante durante el periodo de garantía (se podrá solicitar comprobante de servicio).</li>
        <li>La reparación deberá realizarse en el taller que AUTOVÍA designe para diagnóstico y, en su caso, reparación bajo garantía.</li>
        <li>La garantía es intransferible salvo autorización expresa por escrito de AUTOVÍA.</li>
      </ul>

      <h2>5. Procedimiento de reclamación</h2>
      <ul>
        <li>El cliente contacta a AUTOVÍA reportando la falla, indicando datos del vehículo, kilometraje actual y descripción del problema.</li>
        <li>AUTOVÍA cita al cliente para diagnóstico en el taller designado.</li>
        <li>Si el diagnóstico confirma que la falla está cubierta, AUTOVÍA cubre la reparación o reemplazo de la(s) pieza(s) garantizada(s), conforme a los límites de tiempo/kilometraje vigentes a la fecha del reporte.</li>
        <li>Si el diagnóstico determina que la falla no está cubierta (por las exclusiones del numeral 3, o por estar fuera de plazo/kilometraje), AUTOVÍA informará el motivo por escrito y presentará al cliente el presupuesto de reparación a su cargo.</li>
      </ul>

      <h2>6. Límite de responsabilidad</h2>
      <p>
        La responsabilidad de AUTOVÍA bajo esta garantía se limita exclusivamente a la reparación o
        sustitución de la(s) pieza(s) de motor y/o transmisión cubierta(s), y no incluye gastos de grúa,
        vehículo sustituto, lucro cesante, ni daños indirectos, salvo que se pacte expresamente lo contrario.
      </p>

      <h2>7. Vigencia y aceptación</h2>
      <p>
        Esta garantía es adicional a los derechos que la Ley Federal de Protección al Consumidor otorga al
        cliente y no los sustituye. El cliente declara conocer y aceptar los términos de esta garantía al
        momento de la firma del contrato de compraventa y/o de crédito correspondiente.
      </p>
    </LegalPage>
  );
}
