import React from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
// import './frontstore.css';

export default function FrontstoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}