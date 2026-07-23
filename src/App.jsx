import React, { useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import InfoSection from './components/InfoSection/InfoSection';
import Location from './components/Location/Location';
import Inventory from './components/Inventory/Inventory';
import CarDetail from './components/CarDetail/CarDetail';
import Footer from './components/Footer/Footer';

function App() {
  const [view, setView] = useState('inicio'); // 'inicio' or 'tienda'
  const [selectedCarSlug, setSelectedCarSlug] = useState(null);

  const handleViewChange = (newView) => {
    setView(newView);
    // Clear selection when navigating away or switching main sections
    setSelectedCarSlug(null);
  };

  return (
    <>
      <Header currentView={view} onViewChange={handleViewChange} />
      <main>
        {view === 'inicio' && (
          <>
            <Hero />
            <InfoSection />
            <Location />
          </>
        )}
        
        {view === 'tienda' && (
          selectedCarSlug ? (
            <CarDetail carSlug={selectedCarSlug} onBack={() => setSelectedCarSlug(null)} />
          ) : (
            <Inventory onSelectCar={setSelectedCarSlug} />
          )
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
