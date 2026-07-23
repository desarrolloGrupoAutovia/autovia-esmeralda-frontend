import React from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import InfoSection from './components/InfoSection/InfoSection';
import Location from './components/Location/Location';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <InfoSection />
        <Location />
      </main>
      <Footer />
    </>
  );
}

export default App;
