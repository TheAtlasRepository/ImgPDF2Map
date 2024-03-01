import React from 'react';
import Link from 'next/link';
import Logo from './logo';

interface NavbarProps {
    activePage: string;
}

const Navbar: React.FC<NavbarProps> = ({ activePage }) => {
  return (
    <div className="flex justify-between items-center py-3 px-4 background-dark mb-10">
      <div className="flex items-center px-5">
        <Logo />
      </div>
      <div className="flex items-center">
        <div className="flex items-center text-xs">
          <button className={`btn-nav ${activePage === 'Home' ? 'btn-nav-active' : ''}`}>
            <Link href="/">Home</Link>  
          </button>

          <button className={`btn-nav ${activePage === 'About' ? 'btn-nav-active' : ''}`}>
            <Link href="/About">About</Link>  
          </button>

          <button className={`btn-nav ${activePage === 'Your Data' ? 'btn-nav-active' : ''}`}>
            <Link href="/Privacy">Your Data</Link>  
          </button>

          <button className={`btn-nav ${activePage === 'Contact' ? 'btn-nav-active' : ''}`}>
            <Link href="/Contact">Contact</Link>  
          </button>

          <button className={`btn-nav ${activePage === 'Text & CSV To Map' ? 'btn-nav-active' : ''}`}>
            <Link href="/Text2Map">Text & CSV To Map</Link>  
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;