import React from 'react';
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
            <a href="#">Home</a>  
          </button>

          <button className={`btn-nav ${activePage === 'About' ? 'btn-nav-active' : ''}`}>
            <a href="#">About</a>  
          </button>

          <button className={`btn-nav ${activePage === 'Your Data' ? 'btn-nav-active' : ''}`}>
            <a href="#">Your Data</a>  
          </button>

          <button className={`btn-nav ${activePage === 'Contact' ? 'btn-nav-active' : ''}`}>
            <a href="#">Contact</a>  
          </button>

          <button className={`btn-nav ${activePage === 'Text & CSV To Map' ? 'btn-nav-active' : ''}`}>
            <a href="#">Text & CSV To Map</a>  
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;