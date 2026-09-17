import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Inventory from './components/Inventory/Inventory';
import CarDetail from './components/CarDetail/CarDetail';
import Seguimiento from './components/Seguimiento/Seguimiento';
import AvisoPrivacidad from './components/LegalPage/AvisoPrivacidad';
import TerminosCondiciones from './components/LegalPage/TerminosCondiciones';
import Garantia from './components/LegalPage/Garantia';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventario" element={<Inventory />} />
          <Route path="/inventario/:slug" element={<CarDetail />} />
          <Route path="/seguimiento/:id" element={<Seguimiento />} />
          <Route path="/aviso-privacidad" element={<AvisoPrivacidad />} />
          <Route path="/terminos-y-condiciones" element={<TerminosCondiciones />} />
          <Route path="/garantia" element={<Garantia />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
