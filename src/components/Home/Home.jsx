import React from 'react';
import Hero from '../Hero/Hero';
import Categories from '../Categories/Categories';
import Brands from '../Brands/Brands';
import FeaturedCatalog from '../FeaturedCatalog/FeaturedCatalog';
import CreditSection from '../CreditSection/CreditSection';
import Warranty from '../Warranty/Warranty';
import WhyUs from '../WhyUs/WhyUs';
import Testimonials from '../Testimonials/Testimonials';
import Location from '../Location/Location';

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Brands />
      <FeaturedCatalog />
      <CreditSection />
      <Warranty />
      <WhyUs />
      <Testimonials />
      <Location />
    </>
  );
}
