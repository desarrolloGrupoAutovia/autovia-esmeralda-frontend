import React, { useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import InfoSection from './components/InfoSection/InfoSection';
import Location from './components/Location/Location';
import Inventory from './components/Inventory/Inventory';
import Footer from './components/Footer/Footer';

function App() {
  const [view, setView] = useState('inicio'); // 'inicio' or 'tienda'

  return (
    <>
      <Header currentView={view} onViewChange={setView} />
      <main>
        {view === 'inicio' ? (
          <>
            <Hero />
            <InfoSection />
            <Location />
          </>
        ) : (
          <Inventory />
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
